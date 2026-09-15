import { db } from "../../../db";
import { students, grades, evaluations, subjects, homeworks } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import type { RpcContext } from "../../types";
import { getCurrentPeriodKey, toPronoteDateFormat } from "../../../helpers/date";

import metadata from "../../../../config/metadata.json";
import staticHomepageData from "../../../../config/constants/student/homepage.json";

function formatPronoteDate(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export const handleStudentHomepage = async (_body: any, ctx: RpcContext) => {
    const studentId = ctx.session.userId;
    if (!studentId) {
        throw new Error("Unauthorized: Student session lacks userId");
    }

    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const currentPeriodKey = getCurrentPeriodKey(metadata.Periodes);
    const currentPeriod = metadata.Periodes[currentPeriodKey as keyof typeof metadata.Periodes];

    const studentGrades = await db
        .select({
            gradeValue: grades.grade,
            isAbsent: grades.isAbsent,
            isExempted: grades.isExempted,
            outOf: evaluations.outOf,
            evalDate: evaluations.date,
            subjectName: subjects.name,
        })
        .from(grades)
        .innerJoin(evaluations, eq(grades.evaluationId, evaluations.id))
        .innerJoin(subjects, eq(evaluations.subjectId, subjects.id))
        .where(eq(grades.studentId, studentId))
        .orderBy(desc(evaluations.date))
        .limit(5);

    const transformedGrades = studentGrades.map((g, index) => {
        let noteStr = g.gradeValue !== null ? g.gradeValue.toString() : "|1";
        if (g.isAbsent) noteStr = "|1";
        if (g.isExempted) noteStr = "|2";

        return {
            N: "0001",
            G: 60,
            note: {
                _T: 10,
                V: noteStr,
            },
            bareme: {
                _T: 10,
                V: g.outOf.toString(),
            },
            baremeParDefaut: {
                _T: 10,
                V: 20,
            },
            date: {
                _T: 7,
                V: toPronoteDateFormat(g.evalDate),
            },
            ListeThemes: {
                _T: 24,
                V: [],
            },
            periode: {
                _T: 24,
                V: {
                    L: currentPeriod.name,
                    N: "0001",
                },
            },
            service: {
                _T: 24,
                V: {
                    G: 12,
                    L: g.subjectName,
                    N: "0001",
                    couleur: "#F49737",
                },
            },
        };
    });

    let transformedHomeworks: any[] = [];
    if (student.classId) {
        const homeworkRows = await db
            .select({
                id: homeworks.id,
                title: homeworks.title,
                description: homeworks.description,
                givenDate: homeworks.givenDate,
                dueDate: homeworks.dueDate,
                hexColor: homeworks.hexColor,
                isLocked: homeworks.isLocked,
                subjectName: subjects.name,
            })
            .from(homeworks)
            .innerJoin(subjects, eq(homeworks.subjectId, subjects.id))
            .where(eq(homeworks.classId, student.classId))
            .orderBy(homeworks.dueDate);

        let serviceOrder = 12;
        const servicesMap: Record<string, number> = {};

        transformedHomeworks = homeworkRows.map((hw, index) => {
            if (!servicesMap[hw.subjectName]) {
                servicesMap[hw.subjectName] = serviceOrder++;
            }

            const rawDesc = hw.description ?? hw.title;
            const htmlDesc = `<div>${rawDesc.replace(/\n/g, "<br/>")}</div>`;

            return {
                G: 0,
                ordre: index + 1,
                couleurFond: hw.hexColor,
                couleurTexte: "#000000",
                donneLe: {
                    _T: 7,
                    V: toPronoteDateFormat(hw.givenDate),
                },
                pourLe: {
                    _T: 7,
                    V: toPronoteDateFormat(hw.dueDate),
                },
                listeDocumentJoint: {
                    _T: 24,
                    V: [],
                },
                matiere: {
                    _T: 24,
                    V: {
                        L: hw.subjectName,
                        N: `8200${servicesMap[hw.subjectName]}`,
                    },
                },
                N: `1500${index + 2}`,
                TAFFait: hw.isLocked,
                avecRendu: false,
                peuRendre: false,
                descriptif: {
                    _T: 21,
                    V: htmlDesc,
                },
                duree: 0,
                niveauDifficulte: 0,
            };
        });
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    return {
        notes: {
            avecDetailDevoir: true,
            avecDetailService: true,
            listeDevoirs: {
                _T: 24,
                V: transformedGrades,
            },
            page: {
                periode: {
                    _T: 24,
                    V: {
                        L: currentPeriod.name,
                        N: "0001",
                    },
                },
            },
        },
        travailAFaire: {
            listeTAF: {
                _T: 24,
                V: transformedHomeworks,
            },
        },
        prochaineDate: {
            _T: 7,
            V: formatPronoteDate(tomorrow),
        },
        dateSelectionnee: {
            _T: 7,
            V: formatPronoteDate(now),
        },
        ...staticHomepageData,
    };
};