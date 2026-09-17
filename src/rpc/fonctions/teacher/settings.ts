import type { RpcContext } from "../../types";
import { eq, inArray } from "drizzle-orm";
import { 
    db, 
    teachers, 
    classes, 
    classTeachersSubjects, 
    groupTeachersSubjects, 
    groups, 
    subjects 
} from "../../../db";

import metadata from "../../../../config/metadata.json";
import teacherTabsData from "../../../../config/constants/teacher/tabs.json";
import teacherStaticSettings from "../../../../config/constants/teacher/staticSettings.json";

export const handleTeacherSettings = async (_body: any, ctx: RpcContext) => {
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
    // 1. Fetch all class and group assignments for the teacher
    const classAssignments = await db.query.classTeachersSubjects.findMany({
        where: eq(classTeachersSubjects.teacherId, teacherId),
    });

    const groupAssignments = await db.query.groupTeachersSubjects.findMany({
        where: eq(groupTeachersSubjects.teacherId, teacherId),
    });

    const taughtClassIds = new Set<number>(classAssignments.map((a) => a.classId));
    const taughtGroupIds = new Set<number>(groupAssignments.map((a) => a.groupId));
    const taughtSubjectIds = new Set<number>([
        ...classAssignments.map((a) => a.subjectId),
        ...groupAssignments.map((a) => a.subjectId),
    ]);

    // 2. Fetch all classes, groups, and subjects for the school
    const allClasses = await db.query.classes.findMany();
    const allGroups = await db.query.groups.findMany();
    const allSubjects = await db.query.subjects.findMany();

    // 3. Construct the list of classes and groups with their respective details
    const listeClasses: any[] = [];

    for (const c of allClasses) {
        const enseigne = taughtClassIds.has(c.id);
        const isHeadTeacher = c.headTeacherId === teacherId;

        const classEntry: Record<string, any> = {
            L: c.name,
            N: c.id.toString().padStart(4, "0"),
            G: 1,
        };

        if (enseigne) {
            classEntry.enseigne = true;
        }
        if (isHeadTeacher) {
            classEntry.estPrincipal = true;
        }

        listeClasses.push(classEntry);
    }

    for (const g of allGroups) {
        const enseigne = taughtGroupIds.has(g.id);

        const groupEntry: Record<string, any> = {
            L: g.name,
            N: g.id.toString().padStart(4, "0"),
            G: 2,
        };

        if (enseigne) {
            groupEntry.enseigne = true;
        }

        listeClasses.push(groupEntry);
    }

    // 4. Construct the list of subjects with their respective details
    const listeMatieres = allSubjects.map((s) => ({
        L: s.name,
        N: s.id.toString().padStart(4, "0"),
        code: s.name.substring(0, 6).toUpperCase().trim(),
        couleur: "#C0C0C0",
        estEnseignee: taughtSubjectIds.has(s.id),
        estUtilise: true,
    }));

    // 5. Construct the full name of the teacher with appropriate title
    const civilite = teacher.gender === "F" ? "Mme" : "M.";
    const fullName = `${civilite} ${teacher.lastName.toUpperCase()} ${teacher.firstName}`;

    return {
        _Signature_: {
            ModeExclusif: false,
        },
        ressource: {
            L: fullName,
            N: teacher.id.toString().padStart(4, "0"),
            G: 3,
            estDirecteur: false,
            notificationsPush: false,
            avecPhoto: false,
            Etablissement: {
                _T: 24,
                V: {
                    L: metadata.title ?? "Établissement Démo",
                    N: "0001",
                },
            },
        },
        listeClasses: {
            _T: 24,
            V: listeClasses,
        },
        listeMatieres: {
            _T: 24,
            V: listeMatieres,
        },
        listeInformationsEtablissements: {
            _T: 24,
            V: [
                {
                    L: metadata.title ?? "Établissement Démo",
                    N: "0001",
                    urlLogo: {
                        _T: 23,
                        V: "fichierurlpublique/logo.png",
                    },
                    Coordonnees: {
                        Adresse1: teacher.address_line1 ?? "",
                        Adresse2: teacher.address_line2 ?? "",
                        CodePostal: teacher.postalCode ?? "",
                        LibellePostal: "",
                        LibelleVille: teacher.city ?? "",
                        Province: teacher.state ?? "",
                        Pays: teacher.country ?? "France",
                        SiteInternet: "",
                    },
                    avecInformations: true,
                },
            ],
        },
        ...teacherStaticSettings,
        ...teacherTabsData,
    };
};