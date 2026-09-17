import { db } from "../../../db";
import { 
    students, 
    classes, 
    teachers, 
    classTeachersSubjects, 
    groupStudents,
    groupTeachersSubjects
} from "../../../db/schema";
import { eq, inArray } from "drizzle-orm";
import type { RpcContext } from "../../types";

function toPronoteDateFormat(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export const handleTeacherResources = async (body: any, ctx: RpcContext) => {
    const teacherId = ctx.session.userId;
    if (!teacherId) {
        throw new Error("Unauthorized: Teacher session lacks userId");
    }

    // 1. Extract the resource information from the request body
    const donnees = body.donneesSec?.donnees || body.dataSec?.data || body;
    const ressourceParam = donnees?.ressource || donnees?.classe || donnees?.groupe;
    const genreRessource = donnees?.genreRessource ?? ressourceParam?.G;

    let targetClassId: number | null = null;
    let targetGroupId: number | null = null;

    if (ressourceParam?.N) {
        const idNum = parseInt(ressourceParam.N, 10);
        if (!Number.isNaN(idNum)) {
            if (genreRessource === 2) {
                targetGroupId = idNum;
            } else {
                targetClassId = idNum;
            }
        }
    }

    // 2. Fetch students based on the provided class or group ID
    let studentRows: any[] = [];

    if (targetGroupId) {
        const groupMemberships = await db.query.groupStudents.findMany({
            where: eq(groupStudents.groupId, targetGroupId),
        });
        const studentIds = groupMemberships.map((m) => m.studentId);
        if (studentIds.length > 0) {
            studentRows = await db.query.students.findMany({
                where: inArray(students.id, studentIds),
                orderBy: (students, { asc }) => [asc(students.lastName), asc(students.firstName)],
            });
        }
    } else if (targetClassId) {
        studentRows = await db.query.students.findMany({
            where: eq(students.classId, targetClassId),
            orderBy: (students, { asc }) => [asc(students.lastName), asc(students.firstName)],
        });
    } else {
        // Fallback : renvoie les élèves associés aux classes enseignées par le professeur
        const teacherAssignments = await db.query.classTeachersSubjects.findMany({
            where: eq(classTeachersSubjects.teacherId, teacherId),
        });
        const classIds = Array.from(new Set(teacherAssignments.map((a) => a.classId)));

        if (classIds.length > 0) {
            studentRows = await db.query.students.findMany({
                where: inArray(students.classId, classIds),
                orderBy: (students, { asc }) => [asc(students.lastName), asc(students.firstName)],
            });
        }
    }

    // 3. Prepare a cache for classes and a map for teachers to optimize lookups
    const classCache = new Map<number, any>();
    const teachersList = await db.query.teachers.findMany();
    const teachersMap = new Map<number, any>(teachersList.map((t) => [t.id, t]));

    const formatTeacherName = (t: any) => {
        const prefix = t.gender === "F" ? "Mme" : "M.";
        const initial = t.firstName ? `${t.firstName.charAt(0)}.` : "";
        return `${prefix} ${t.lastName.toUpperCase()} ${initial}`.trim();
    };

    const transformedStudents: any[] = [];

    for (const student of studentRows) {
        let studentClass = classCache.get(student.classId);
        if (!studentClass && student.classId) {
            studentClass = await db.query.classes.findFirst({
                where: eq(classes.id, student.classId),
            });
            if (studentClass) {
                classCache.set(student.classId, studentClass);
            }
        }

        const listePP: any[] = [];
        if (studentClass?.headTeacherId) {
            const pp = teachersMap.get(studentClass.headTeacherId);
            if (pp) {
                listePP.push({
                    L: formatTeacherName(pp),
                    N: pp.id.toString().padStart(4, "0"),
                    G: 3,
                    avecDiscussion: true,
                });
            }
        }

        const teamAssignments = studentClass
            ? await db.query.classTeachersSubjects.findMany({
                  where: eq(classTeachersSubjects.classId, studentClass.id),
              })
            : [];

        const teamTeacherIds = Array.from(new Set(teamAssignments.map((a) => a.teacherId)));
        const listeEquipePeda: any[] = [];

        for (const tId of teamTeacherIds) {
            const t = teachersMap.get(tId);
            if (t) {
                listeEquipePeda.push({
                    L: formatTeacherName(t),
                    N: t.id.toString().padStart(4, "0"),
                    G: 3,
                    P: t.id,
                    avecDiscussion: true,
                });
            }
        }

        const listeResponsables = [
            {
                L: `M. ${student.lastName.toUpperCase()} Représentant`,
                N: `resp_1_${student.id}`,
                G: 5,
                avecDiscussion: true,
            },
            {
                L: `Mme ${student.lastName.toUpperCase()} Représentant`,
                N: `resp_2_${student.id}`,
                G: 5,
                avecDiscussion: true,
            },
        ];

        const fullName = `${student.lastName.toUpperCase()} ${student.firstName}`;
        const defaultDateEntree = toPronoteDateFormat(student.createdAt ?? new Date());

        transformedStudents.push({
            L: fullName,
            N: student.id.toString().padStart(4, "0"),
            G: 4,
            P: student.id,
            nom: student.lastName.toUpperCase(),
            prenoms: student.firstName,
            A: true,
            neLe: {
                _T: 7,
                V: "01/01/2011",
            },
            sexe: student.gender === "F" ? 1 : 0,
            regime: "DEMI-PENSIONNAIRE DANS L'ETABLISSEMENT",
            avecEncouragements: false,
            avecValorisation: false,
            entree: {
                _T: 7,
                V: defaultDateEntree,
            },
            listeProjets: {
                _T: 24,
                V: [],
            },
            listeAttestations: {
                _T: 24,
                V: [],
            },
            option1: "ANGLAIS LV1",
            option2: "ESPAGNOL LV2",
            email: student.email ?? "",
            avecDiscussion: true,
            listeRessources: {
                _T: 24,
                V: listeResponsables,
            },
            listePP: {
                _T: 24,
                V: listePP,
            },
            listeTuteurs: {
                _T: 24,
                V: [],
            },
            listeEquipePeda: {
                _T: 24,
                V: listeEquipePeda,
            },
            rattacheA: "",
        });
    }

    return {
        listeRessources: {
            _T: 24,
            V: transformedStudents,
        },
        listeElevesRattaches: {
            _T: 24,
            V: [],
        },
    };
};