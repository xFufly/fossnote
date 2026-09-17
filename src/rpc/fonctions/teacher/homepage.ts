import { db } from "../../../db";
import { 
    teachers, 
    classes, 
    classTeachersSubjects, 
    subjects, 
    evaluations, 
    homeworks, 
    students 
} from "../../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { RpcContext } from "../../types";
import { getCurrentPeriodKey, toPronoteDateFormat } from "../../../helpers/date";

import metadata from "../../../../config/metadata.json";
import staticHomepageData from "../../../../config/constants/teacher/homepage.json";

export const handleTeacherHomepage = async (_body: any, ctx: RpcContext) => {
    const teacherId = ctx.session.userId;
    if (!teacherId) {
        throw new Error("Unauthorized: Teacher session lacks userId");
    }

    const teacher = await db.query.teachers.findFirst({
        where: eq(teachers.id, teacherId),
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    const currentPeriodKey = getCurrentPeriodKey(metadata.Periodes);
    const currentPeriod = metadata.Periodes[currentPeriodKey as keyof typeof metadata.Periodes];

    // 1. Fetch all class and group assignments for the teacher
    const assignments = await db
        .select({
            classId: classTeachersSubjects.classId,
            className: classes.name,
            subjectId: classTeachersSubjects.subjectId,
            subjectName: subjects.name,
        })
        .from(classTeachersSubjects)
        .innerJoin(classes, eq(classTeachersSubjects.classId, classes.id))
        .innerJoin(subjects, eq(classTeachersSubjects.subjectId, subjects.id))
        .where(eq(classTeachersSubjects.teacherId, teacherId));

    // 2. Construct the list of classes for the teacher's homepage
    const classesConseil: any[] = [];
    const periodName = currentPeriod?.name ?? "Trimestre 1";

    for (const assign of assignments) {
        // Count the number of evaluations for this class and subject in the current period
        const evalRows = await db
            .select({ count: sql<number>`count(*)` })
            .from(evaluations)
            .where(
                and(
                    eq(evaluations.teacherId, teacherId),
                    eq(evaluations.classId, assign.classId),
                    eq(evaluations.subjectId, assign.subjectId)
                )
            );

        const nbDevoirs = Number(evalRows[0]?.count ?? 0);

        classesConseil.push({
            L: assign.className,
            N: assign.classId.toString().padStart(4, "0"),
            periode: {
                _T: 24,
                V: {
                    L: periodName,
                    N: "0001",
                },
            },
            UniquementServicesSansNote: false,
            nbDevoirs,
            notationEstCloturee: false,
            serviceSuggereNote: {
                _T: 24,
                V: {
                    L: assign.subjectName,
                    N: assign.subjectId.toString().padStart(4, "0"),
                },
            },
            nbEvaluations: 0,
            evaluationEstCloturee: false,
            serviceSuggereEval: {
                _T: 24,
                V: {
                    L: assign.subjectName,
                    N: assign.subjectId.toString().padStart(4, "0"),
                },
            },
            auMoinsUnEleveDsServicesAppr: true,
            nbAppreciationsSaisies: 0,
            nbAppreciationsTotales: 0,
            appEstCloturee: false,
            serviceSuggereApp: {
                _T: 24,
                V: {
                    L: assign.subjectName,
                    N: assign.subjectId.toString().padStart(4, "0"),
                },
            },
        });
    }

    // 3. Fetch the latest homeworks assigned by the teacher
    const teacherHomeworks = await db
        .select({
            id: homeworks.id,
            title: homeworks.title,
            description: homeworks.description,
            dueDate: homeworks.dueDate,
            classId: homeworks.classId,
            className: classes.name,
        })
        .from(homeworks)
        .leftJoin(classes, eq(homeworks.classId, classes.id))
        .where(eq(homeworks.teacherId, teacherId))
        .orderBy(homeworks.dueDate)
        .limit(10);

    const listeTAF: any[] = [];
    for (const hw of teacherHomeworks) {
        let totalStudents = 0;
        if (hw.classId) {
            const studentCountRes = await db
                .select({ count: sql<number>`count(*)` })
                .from(students)
                .where(eq(students.classId, hw.classId));
            totalStudents = Number(studentCountRes[0]?.count ?? 0);
        }

        const rawDesc = hw.description ?? hw.title;
        const htmlDesc = `<div>${rawDesc.replace(/\n/g, "<br/>")}</div>`;

        listeTAF.push({
            N: hw.id.toString().padStart(4, "0"),
            G: 38,
            classe: hw.className ?? "",
            date: {
                _T: 7,
                V: toPronoteDateFormat(hw.dueDate),
            },
            descriptif: {
                _T: 21,
                V: htmlDesc,
            },
            strNombreRendus: `0/${totalStudents}`,
            genreRendu: 2,
        });
    }

    return {
        conseilDeClasse: {
            avecNotes: true,
            avecCompetences: true,
            avecAppr: true,
            listeClasses: {
                _T: 24,
                V: classesConseil,
            },
            periodeParDefaut: {
                _T: 24,
                V: {
                    L: periodName,
                    N: "0001",
                },
            },
        },
        TAFARendre: {
            listeTAF: {
                _T: 24,
                V: listeTAF,
            },
        },
        ListeCours: [],
        ...staticHomepageData,
    };
};