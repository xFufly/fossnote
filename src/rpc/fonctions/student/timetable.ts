import { db } from "../../../db";
import { lessons, classes, subjects, teachers, rooms, students } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import type { RpcContext } from "../../types";

import { getPronoteWeekNumber } from "../../../helpers/date";

export const handlePageEmploiDuTempsDomainePresence = async (body: any, ctx: RpcContext) => {
    return {
        Domaine: {
            _T: 8,
            V: "[1..4,8..52]"
        },
        joursPresence: {
            _T: 11,
            V: "[0..3,6..10,13..17,20..24,27..31,34..38,41..45,48..52,55..59,62..66,69..73,76..80,83..87,90..94,97..101,104..108,111..115,118..122,125..129,132..136,139..143,146..150,153..157,160..164,167..171,174..178,181..185,188..192,195..199,202..206,209..213,216..220,223..227,230..234,237..241,244..248,251..255,258..262,265..269,272..276,279..283,286..290,293..297,300..304,307..311,314..318,321..325,328..332,335..339,342..346,349..353,356..360]"
        }
    };
};

export const handlePageEmploiDuTemps = async (body: any, ctx: RpcContext) => {
    const studentId = ctx.session.userId;
    if (!studentId) {
        throw new Error("Unauthorized: Student session lacks userId");
    }

    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId),
    });

    if (!student || !student.classId) {
        throw new Error("Student not found or not in a class");
    }

    const data = body?.donneesSec?.donnees || body?.dataSec?.data;
    const requestedWeek = data?.numeroSemaine ?? data?.NumeroSemaine;

    const allClassLessons = await db.query.lessons.findMany({
        where: eq(lessons.classId, student.classId),
        with: {
            subject: true,
            teacher: true,
            room: true
        }
    });

    const classLessons = allClassLessons.filter(lesson => {
        if (!requestedWeek) return true;
        const lessonDate = new Date(lesson.date);
        const lessonWeek = getPronoteWeekNumber(lessonDate);
        return lessonWeek === requestedWeek;
    });

    const ListeCours = classLessons.map((lesson) => {
        const dateObj = new Date(lesson.date);
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:00`;

        const ListeContenus = [];
        
        if (lesson.subject) {
            ListeContenus.push({
                L: lesson.subject.name.toUpperCase(),
                N: `79#${lesson.subject.id}`,
                G: 16
            });
        }
        
        if (lesson.teacher) {
            ListeContenus.push({
                L: `${lesson.teacher.lastName.toUpperCase()} ${lesson.teacher.firstName[0]}.`,
                G: 3
            });
        }
        
        if (lesson.room) {
            ListeContenus.push({
                L: lesson.room.name,
                N: `129#${lesson.room.id}`,
                G: 17
            });
        }

        return {
            N: `29#${lesson.id}`,
            G: 0,
            P: lesson.id,
            place: lesson.startSlot,
            duree: lesson.duration,
            DateDuCours: {
                _T: 7,
                V: dateStr
            },
            CouleurFond: lesson.hexColor,
            ListeContenus: {
                _T: 24,
                V: ListeContenus
            },
            AvecTafPublie: false,
            AvecCdT: false,
            ...(lesson.isCancelled ? {
                estAnnule: true,
                Statut: lesson.status || "Cours annulé"
            } : {})
        };
    });

    const joursCycle = [];
    if (requestedWeek) {
        for (let i = 0; i < 5; i++) {
            joursCycle.push({
                jourCycle: i,
                numeroSemaine: requestedWeek,
                DP: {
                    midi: {
                        icone: { text: "", check: true },
                        hint: "L'élève était présent au repas de midi"
                    }
                }
            });
        }
    }

    return {
        avecCoursAnnule: true,
        avecExportICal: true,
        prefsGrille: {
            genreRessource: 4 // Hardcoded for now
        },
        ListeCours: ListeCours,
        premierePlaceHebdoDuJour: 80,
        debutDemiPensionHebdo: 88,
        finDemiPensionHebdo: 91,
        absences: {
            joursCycle: {
                _T: 24,
                V: joursCycle
            }
        },
        recreations: {
            _T: 24,
            V: [
                {
                    L: "Récréation du matin",
                    place: 4
                }
            ]
        }
    };
};

export const handleFicheCours = async (body: any, ctx: RpcContext) => {
    const data = body?.donneesSec?.donnees || body?.dataSec?.data;
    const coursN = data?.cours?.N;
    
    if (!coursN) {
        throw new Error("Missing cours ID in FicheCours request");
    }
    
    const lessonIdStr = coursN.split("#")[1];
    const lessonId = parseInt(lessonIdStr, 10);
    
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            subject: true,
            teacher: true,
            room: true,
            class: true
        }
    });
    
    if (!lesson) {
        throw new Error("Lesson not found");
    }
    
    const dateObj = new Date(lesson.date);
    const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:00`;

    const ListeContenus = [];
    
    if (lesson.teacher) {
        ListeContenus.push({
            L: `M. ${lesson.teacher.lastName.toUpperCase()} ${lesson.teacher.firstName[0]}.`,
            N: `109#${lesson.teacher.id}`,
            G: 3,
            P: lesson.teacher.id
        });
    }
    
    if (lesson.class) {
        ListeContenus.push({
            L: lesson.class.name,
            N: `23#${lesson.class.id}`,
            G: 1
        });
    }
    
    if (lesson.room) {
        ListeContenus.push({
            L: lesson.room.name,
            N: `129#${lesson.room.id}`,
            G: 17,
            nombre: 1
        });
    }

    const requestedWeek = data?.numeroSemaine || getPronoteWeekNumber(dateObj);

    return {
        listeCours: {
            _T: 24,
            V: [
                {
                    N: coursN,
                    G: 0,
                    P: lesson.id,
                    place: lesson.startSlot,
                    duree: lesson.duration,
                    DateDuCours: {
                        _T: 7,
                        V: dateStr
                    },
                    avecCDT: false, // Default to false for now
                    numeroSemaine: requestedWeek,
                    ListeContenus: {
                        _T: 24,
                        V: ListeContenus
                    },
                    matiere: lesson.subject ? {
                        _T: 24,
                        V: {
                            L: lesson.subject.name.toUpperCase(),
                            N: `79#${lesson.subject.id}`,
                            CouleurFond: lesson.hexColor,
                            CouleurTexte: "#000000"
                        }
                    } : undefined
                }
            ]
        }
    };
};
