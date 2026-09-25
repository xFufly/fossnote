import { db } from "../../../db";
import { grades, evaluations, subjects, students } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import type { RpcContext } from "../../types";

import metadata from "../../../../config/metadata.json";
import { getCurrentPeriodKey, toPronoteDateFormat } from "../../../helpers/date";

function formatAvg(val: number): string {
    if (isNaN(val) || val === null || val === undefined) return "";
    return val.toFixed(2).replace(".", ",");
}

function formatGrade(val: number): string {
    return val.toString().replace(".", ",");
}

export const handleStudentGrades = async (_body: any, ctx: RpcContext) => {
    const studentId = ctx.session.userId;
    if (!studentId) {
        throw new Error("Unauthorized: Student session lacks userId");
    }

    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId)
    });
    
    if (!student) {
        throw new Error("Student not found");
    }

    const periodes = metadata.Periodes as Record<string, { name: string; from: string; to: string }>;
    const currentPeriodKey = getCurrentPeriodKey(periodes);
    const currentPeriod = periodes[currentPeriodKey] ?? Object.values(periodes)[0];

    const notesRows = await db
        .select({
            id: grades.id,
            evaluationId: evaluations.id,
            gradeValue: grades.grade,
            isAbsent: grades.isAbsent,
            isExempted: grades.isExempted,
            outOf: evaluations.outOf,
            coefficient: evaluations.coefficient,
            title: evaluations.title,
            evalDate: evaluations.date,
            subjectName: subjects.name,
        })
        .from(grades)
        .innerJoin(evaluations, eq(grades.evaluationId, evaluations.id))
        .innerJoin(subjects, eq(evaluations.subjectId, subjects.id))
        .where(eq(grades.studentId, studentId))
        .orderBy(desc(evaluations.date));

    let classAveragesBySubject: Record<string, {
        moyEleve: number;
        moyClasse: number;
        moyMin: number;
        moyMax: number;
    }> = {};

    let evalStats: Record<number, {
        sum: number;
        count: number;
        min: number;
        max: number;
    }> = {};

    if (student.classId) {
        const allClassGrades = await db
            .select({
                studentId: grades.studentId,
                gradeValue: grades.grade,
                isAbsent: grades.isAbsent,
                isExempted: grades.isExempted,
                outOf: evaluations.outOf,
                coefficient: evaluations.coefficient,
                subjectName: subjects.name,
                evaluationId: evaluations.id,
            })
            .from(grades)
            .innerJoin(evaluations, eq(grades.evaluationId, evaluations.id))
            .innerJoin(subjects, eq(evaluations.subjectId, subjects.id))
            .innerJoin(students, eq(grades.studentId, students.id))
            .where(eq(students.classId, student.classId));

        const subjectStudentGrades: Record<string, Record<number, { sum: number, coeff: number }>> = {};

        for (const g of allClassGrades) {
            if (g.isAbsent || g.isExempted || g.gradeValue === null) continue;
            
            // Eval stats
            if (!evalStats[g.evaluationId]) {
                evalStats[g.evaluationId] = { sum: 0, count: 0, min: Infinity, max: -Infinity };
            }
            evalStats[g.evaluationId].sum += g.gradeValue;
            evalStats[g.evaluationId].count += 1;
            if (g.gradeValue < evalStats[g.evaluationId].min) evalStats[g.evaluationId].min = g.gradeValue;
            if (g.gradeValue > evalStats[g.evaluationId].max) evalStats[g.evaluationId].max = g.gradeValue;

            if (!subjectStudentGrades[g.subjectName]) {
                subjectStudentGrades[g.subjectName] = {};
            }
            if (!subjectStudentGrades[g.subjectName][g.studentId]) {
                subjectStudentGrades[g.subjectName][g.studentId] = { sum: 0, coeff: 0 };
            }
            
            const scaledGrade = (g.gradeValue / (g.outOf || 20)) * 20;
            const weight = g.coefficient || 1;
            
            subjectStudentGrades[g.subjectName][g.studentId].sum += scaledGrade * weight;
            subjectStudentGrades[g.subjectName][g.studentId].coeff += weight;
        }

        for (const [subjectName, studentsMap] of Object.entries(subjectStudentGrades)) {
            let classTotalSum = 0;
            let classTotalStudents = 0;
            let minAvg = Infinity;
            let maxAvg = -Infinity;
            let currentStudentAvg = NaN;

            for (const [sIdStr, data] of Object.entries(studentsMap)) {
                if (data.coeff > 0) {
                    const avg = data.sum / data.coeff;
                    classTotalSum += avg;
                    classTotalStudents += 1;
                    
                    if (avg < minAvg) minAvg = avg;
                    if (avg > maxAvg) maxAvg = avg;
                    
                    if (parseInt(sIdStr) === studentId) {
                        currentStudentAvg = avg;
                    }
                }
            }

            if (classTotalStudents > 0) {
                classAveragesBySubject[subjectName] = {
                    moyEleve: currentStudentAvg,
                    moyClasse: classTotalSum / classTotalStudents,
                    moyMin: minAvg,
                    moyMax: maxAvg
                };
            }
        }
    }

    let serviceOrder = 12;
    const servicesMap: Record<string, number> = {};
    const distinctSubjects = [...new Set(notesRows.map(r => r.subjectName))];

    for (const subjectName of distinctSubjects) {
        if (!servicesMap.hasOwnProperty(subjectName)) {
            servicesMap[subjectName] = serviceOrder;
            serviceOrder++;
        }
    }

    const transformedServices = distinctSubjects.map((subjectName) => {
        const avgs = classAveragesBySubject[subjectName];
        
        return {
            G: 12,
            L: subjectName,
            N: "1300" + servicesMap[subjectName],
            couleur: "#F49737",
            baremeMoyEleve: {
                _T: 10,
                V: "20",
            },
            baremeMoyEleveParDefaut: {
                _T: 10,
                V: "20",
            },
            estServiceEnGroupe: true,
            moyClasse: {
                _T: 10,
                V: avgs && !isNaN(avgs.moyClasse) ? formatAvg(avgs.moyClasse) : "",
            },
            moyEleve: {
                _T: 10,
                V: avgs && !isNaN(avgs.moyEleve) ? formatAvg(avgs.moyEleve) : "",
            },
            moyMax: {
                _T: 10,
                V: avgs && !isNaN(avgs.moyMax) ? formatAvg(avgs.moyMax) : "",
            },
            moyMin: {
                _T: 10,
                V: avgs && !isNaN(avgs.moyMin) ? formatAvg(avgs.moyMin) : "",
            },
            ordre: servicesMap[subjectName],
        };
    });

    let gradeOrder = 0;

    const transformedGrades = notesRows.map((row) => {
        let noteStr = row.gradeValue !== null ? formatGrade(row.gradeValue) : "|1";
        if (row.isAbsent) noteStr = "|1";
        if (row.isExempted) noteStr = "|2";
        
        gradeOrder++;

        const eStats = evalStats[row.evaluationId];

        return {
            N: "3400" + gradeOrder.toString(),
            G: 60,
            note: {
                _T: 10,
                V: noteStr,
            },
            bareme: {
                _T: 10,
                V: (row.outOf ?? 20).toString(),
            },
            baremeParDefaut: {
                _T: 10,
                V: "20",
            },
            date: {
                _T: 7,
                V: toPronoteDateFormat(row.evalDate),
            },
            service: {
                _T: 24,
                V: {
                    G: 12,
                    L: row.subjectName,
                    N: "1300" + servicesMap[row.subjectName],
                    couleur: "#F49737",
                },
            },
            periode: {
                _T: 24,
                V: {
                    L: currentPeriod?.name ?? "Trimestre 1",
                    N: "0001",
                },
            },
            ListeThemes: {
                _T: 24,
                V: [],
            },
            moyenne: {
                _T: 10,
                V: eStats && eStats.count > 0 ? formatAvg(eStats.sum / eStats.count) : "",
            },
            estEnGroupe: false,
            noteMax: {
                _T: 10,
                V: eStats && eStats.count > 0 ? formatGrade(eStats.max) : "",
            },
            noteMin: {
                _T: 10,
                V: eStats && eStats.count > 0 ? formatGrade(eStats.min) : "",
            },
            commentaire: row.title ?? "",
            coefficient: Math.round(row.coefficient ?? 1),
            estFacultatif: false,
            estBonus: false,
            estRamenerSur20: false
        };
    });

    let totalMoyEleve = 0;
    let totalMoyClasse = 0;
    let subjectCountEleve = 0;
    let subjectCountClasse = 0;

    for (const avgs of Object.values(classAveragesBySubject)) {
        if (!isNaN(avgs.moyEleve)) {
            totalMoyEleve += avgs.moyEleve;
            subjectCountEleve++;
        }
        if (!isNaN(avgs.moyClasse)) {
            totalMoyClasse += avgs.moyClasse;
            subjectCountClasse++;
        }
    }

    const moyGenerale = subjectCountEleve > 0 ? totalMoyEleve / subjectCountEleve : NaN;
    const moyGeneraleClasse = subjectCountClasse > 0 ? totalMoyClasse / subjectCountClasse : NaN;

    return {
        moyGenerale: {
            _T: 10,
            V: !isNaN(moyGenerale) ? formatAvg(moyGenerale) : "",
        },
        moyGeneraleClasse: {
            _T: 10,
            V: !isNaN(moyGeneraleClasse) ? formatAvg(moyGeneraleClasse) : "",
        },
        baremeMoyGenerale: {
            _T: 10,
            V: "20",
        },
        baremeMoyGeneraleParDefaut: {
            _T: 10,
            V: "20",
        },
        avecDetailDevoir: true,
        avecDetailService: true,
        listeServices: {
            _T: 24,
            V: transformedServices,
        },
        listeDevoirs: {
            _T: 24,
            V: transformedGrades,
        },
    };
};