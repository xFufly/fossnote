import { db } from "../../../db";
import { students, classes, groupStudents, groups } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { RpcContext } from "../../types";

import metadata from "../../../../config/metadata.json";
import ongletsData from "../../../../config/constants/student/tabs.json";
import piliersData from "../../../../config/constants/student/pillars.json";
import ongletsPeriodesConfig from "../../../../config/constants/student/tabsPeriods.json";
import staticParams from "../../../../config/constants/student/staticSettings.json";

export const handleStudentSettings = async (_body: any, ctx: RpcContext) => {
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

    let className = "Classe inconnue";
    if (student.classId) {
        const studentClass = await db.query.classes.findFirst({
            where: eq(classes.id, student.classId),
        });
        if (studentClass) {
            className = studentClass.name;
        }
    }

    const studentGroupRows = await db.query.groupStudents.findMany({
        where: eq(groupStudents.studentId, studentId),
    });

    const groupsList: { L: string; N: string; G?: number }[] = [];
    for (const row of studentGroupRows) {
        const grp = await db.query.groups.findFirst({
            where: eq(groups.id, row.groupId),
        });
        if (grp) {
            groupsList.push({
                L: grp.name,
                N: grp.id.toString().padStart(4, "0"),
            });
        }
    }

    const trimestresBase = [
        { L: "Trimestre 1", N: "112BF20A4C8EF01", G: 2, A: true, GenreNotation: 1 },
        { L: "Trimestre 2", N: "112BE23A4C8EF8F", G: 2, A: true, GenreNotation: 1 },
        { L: "Trimestre 3", N: "1121922A4C8EF06", G: 2, A: true, GenreNotation: 1 },
    ];
    const horsPeriode = { L: "Hors période", N: "112E926A4C8EF77", G: 4, A: true, GenreNotation: 0 };
    const periodeParDefaut = { L: "Trimestre 2", N: "112BE23A4C8EF8F" };

    const listeOngletsPourPeriodes = ongletsPeriodesConfig.map((cfg: any) => {
        const periodes = [];

        if (cfg.avecAnnee) {
            periodes.push({ G: 1, L: "Année (Trois trimestres)" });
        }

        if (cfg.avecDatesPublication) {
            periodes.push(
                { ...trimestresBase[0], datePublication: { _T: 7, V: "20/11/2022" } },
                { ...trimestresBase[1], datePublication: { _T: 7, V: "26/02/2023" } },
                { ...trimestresBase[2], datePublication: { _T: 7, V: "27/08/2023" } }
            );
        } else {
            periodes.push(...trimestresBase);
        }

        if (!cfg.sansHorsPeriode) {
            periodes.push(horsPeriode);
        }

        return {
            G: cfg.G,
            listePeriodes: {
                "_T": 24,
                "V": periodes,
            },
            periodeParDefaut: {
                "_T": 24,
                "V": periodeParDefaut,
            },
        };
    });

    const fullName = `${student.lastName.toUpperCase()} ${student.firstName}`;

    return {
        _Signature_: {
            ModeExclusif: false,
        },
        ressource: {
            L: fullName,
            N: student.id.toString().padStart(4, "0"),
            G: 4,
            P: 320,
            Etablissement: {
                _T: 24,
                V: {
                    L: metadata.title ?? "Établissement Démo",
                    N: "0001",
                },
            },
            avecPhoto: false,
            classeDEleve: {
                L: className,
                N: student.classId?.toString().padStart(4, "0") ?? "0001",
            },
            listeClassesHistoriques: {
                _T: 24,
                V: [
                    {
                        L: className,
                        N: student.classId?.toString().padStart(4, "0") ?? "0001",
                        AvecNote: true,
                        AvecFiliere: false,
                    },
                ],
            },
            listeGroupes: {
                _T: 24,
                V: groupsList,
            },
            listeOngletsPourPiliers: {
                _T: 24,
                V: piliersData,
            },
            listeOngletsPourPeriodes: {
                _T: 24,
                V: listeOngletsPourPeriodes,
            },
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
                        Adresse1: "",
                        Adresse2: "",
                        CodePostal: "",
                        LibellePostal: "",
                        LibelleVille: "",
                        Province: "",
                        Pays: "",
                        SiteInternet: "",
                    },
                    avecInformations: false,
                },
            ],
        },
        ...staticParams,
        ...ongletsData,
    };
};