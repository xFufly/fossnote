import { db } from "../../../db";
import { students, classes, homeworks, subjects } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { RpcContext } from "../../types";
import { toPronoteDateFormat } from "../../../helpers/date";

export const handleStudentHomeworks = async (_body: any, ctx: RpcContext) => {
    const studentId = ctx.session.userId;
    if (!studentId) {
        throw new Error("Unauthorized: Student session lacks userId");
    }

    // 1. Retrieve student and class name
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    let className = "";
    if (student.classId) {
        const studentClass = await db.query.classes.findFirst({
            where: eq(classes.id, student.classId),
        });
        if (studentClass) {
            className = studentClass.name;
        }
    }

    // 2. Retrieve class homeworks
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
        let homeworksOrder = 1;

        transformedHomeworks = homeworkRows.map((hw) => {
            if (!servicesMap.hasOwnProperty(hw.subjectName)) {
                servicesMap[hw.subjectName] = serviceOrder;
                serviceOrder++;
            }

            const rawDesc = hw.description ?? hw.title;
            const htmlDesc = `<div>${rawDesc.replace(/\n/g, "<br/>")}</div>`;

            const currentN = `1500${homeworksOrder++}`;
            const cahierDeTextesN = `1800${homeworksOrder}`;

            const matierePayload = {
                _T: 24,
                V: {
                    L: hw.subjectName,
                    N: `8200${servicesMap[hw.subjectName]}`,
                },
            };

            return {
                // Pronote uppercase fields - deserialized by the Pronote engine
                CouleurFond: hw.hexColor,
                DonneLe: { _T: 7, V: toPronoteDateFormat(hw.givenDate) },
                PourLe:  { _T: 7, V: toPronoteDateFormat(hw.dueDate) },
                ListePieceJointe: { _T: 24, V: [] },
                ListeThemes: { _T: 24, V: [] },
                Matiere: matierePayload,
                N: currentN,
                TAFFait: Boolean(hw.isLocked),
                avecMiseEnForme: false,
                cahierDeTextes: { _T: 24, N: cahierDeTextesN },
                descriptif: { _T: 21, V: htmlDesc },
                duree: 0,
                libelleCBTheme: "Uniquement les thèmes associés aux matières du travail à faire",
                niveauDifficulte: 0,
                nomPublic: className,
            };
        });
    }

    // 3. Payload returned in donneesSec.donnees
    return {
        ListeTravauxAFaire: {
            _T: 24,
            V: transformedHomeworks,
        },
    };
};