import { db } from "../../../db";
import { grades, evaluations, subjects } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import type { RpcContext } from "../../types";

import metadata from "../../../../config/metadata.json";
import { getCurrentPeriodKey } from "../../../helpers/date";

function toPronoteDateFormat(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    }
    return dateStr;
}

export const handleStudentGrades = async (_body: any, ctx: RpcContext) => {
    const studentId = ctx.session.userId;
    if (!studentId) {
        throw new Error("Unauthorized: Student session lacks userId");
    }

    const periodes = metadata.Periodes as Record<string, { name: string; from: string; to: string }>;
    const currentPeriodKey = getCurrentPeriodKey(periodes);
    const currentPeriod = periodes[currentPeriodKey] ?? Object.values(periodes)[0];

    const notesRows = await db
        .select({
            id: grades.id,
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

    let serviceOrder = 12;
    const servicesMap: Record<string, number> = {};

    for (const row of notesRows) {
        if (!servicesMap.hasOwnProperty(row.subjectName)) {
            servicesMap[row.subjectName] = serviceOrder;
            serviceOrder++;
        }
    }

    const transformedServices = notesRows.map((row) => ({
        G: 12,
        L: row.subjectName,
        N: "1300" + servicesMap[row.subjectName],
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
            V: "??",
        },
        moyEleve: {
            _T: 10,
            V: "??",
        },
        moyMax: {
            _T: 10,
            V: "??",
        },
        moyMin: {
            _T: 10,
            V: "??",
        },
        ordre: servicesMap[row.subjectName],
    }));

    const gradeOrder = 0;

    const transformedGrades = notesRows.map((row) => {
        let noteStr = row.gradeValue !== null ? row.gradeValue.toString() : "|1";
        if (row.isAbsent) noteStr = "|1";
        if (row.isExempted) noteStr = "|2";

        return {
            N: "3400" + gradeOrder.toString(),
            G: 60,
            coefficient: Math.round(row.coefficient ?? 1),
            commentaire: row.title ?? "",
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
            ListeThemes: {
                _T: 24,
                V: [],
            },
            periode: {
                _T: 24,
                V: {
                    L: currentPeriod?.name ?? "Trimestre 1",
                    N: "0001",
                },
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
        };
    });

    return {
        avecDetailDevoir: true,
        avecDetailService: true,
        listeDevoirs: {
            _T: 24,
            V: transformedGrades,
        },
        listeServices: {
            _T: 24,
            V: transformedServices,
        },
    };
};