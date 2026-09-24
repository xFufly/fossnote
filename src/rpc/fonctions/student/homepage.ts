import { db } from "../../../db";
import { students, grades, evaluations, subjects, homeworks, postits, lessons, rooms, teachers } from "../../../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { RpcContext } from "../../types";
import { getCurrentPeriodKey, toPronoteDateFormat } from "../../../helpers/date";
import { getNewsList } from "../news";

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

    const postitData = await db.query.postits.findFirst({
        where: and(eq(postits.userId, studentId), eq(postits.userType, 3)),
    });

    const postitContent = postitData ? postitData.content : "";

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Find the next day with upcoming lessons
    let listeCours: any[] = [];
    let selectedDate = new Date(now);

    if (student.classId) {
        const allClassLessons = await db.query.lessons.findMany({
            where: eq(lessons.classId, student.classId),
            with: {
                subject: true,
                teacher: true,
                room: true
            }
        });

        // We want to find the first day (starting from today) that has at least one lesson in the future
        // Or if today has no lessons, tomorrow, etc.
        let daysOffset = 0;
        let foundLessonsForDay: any[] = [];

        while (daysOffset < 14) { // Look ahead up to 2 weeks
            const checkDate = new Date(now);
            checkDate.setDate(now.getDate() + daysOffset);
            
            const checkStr = `${checkDate.getFullYear()}-${(checkDate.getMonth() + 1).toString().padStart(2, '0')}-${checkDate.getDate().toString().padStart(2, '0')}`;
            
            const dayLessons = allClassLessons.filter(lesson => {
                const lessonDate = new Date(lesson.date);
                const lessonStr = `${lessonDate.getFullYear()}-${(lessonDate.getMonth() + 1).toString().padStart(2, '0')}-${lessonDate.getDate().toString().padStart(2, '0')}`;
                return lessonStr === checkStr;
            });

            // If it's today, we only count it if there is at least one lesson that hasn't finished yet
            // Assuming lessons last a few hours, we can check if the lesson start time is after 'now',
            // or just simple rule: if it's past 17:00, we just skip today.
            let hasUpcoming = false;
            if (daysOffset === 0) {
                hasUpcoming = dayLessons.some(lesson => {
                    const lDate = new Date(lesson.date);
                    // Lesson end time = start time + duration (30 mins per duration unit)
                    const endTime = new Date(lDate.getTime() + lesson.duration * 30 * 60000);
                    return endTime > now;
                });
            } else {
                hasUpcoming = dayLessons.length > 0;
            }

            if (hasUpcoming) {
                foundLessonsForDay = dayLessons;
                selectedDate = checkDate;
                break;
            }
            daysOffset++;
        }

        listeCours = foundLessonsForDay.map((lesson) => {
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
    }

    return {
        penseBete: {
            libelle: postitContent,
        },
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
            V: formatPronoteDate(selectedDate),
        },
        ...staticHomepageData,
        actualites: {
            listeModesAff: [
                {
                    G: 0,
                    listeActualites: {
                        _T: 24,
                        V: await getNewsList(ctx.espaceId),
                    }
                },
                {
                    G: 1,
                    listeActualites: { _T: 24, V: [] }
                },
                {
                    G: 2,
                    listeActualites: { _T: 24, V: [] }
                },
                {
                    G: 3,
                    listeActualites: { _T: 24, V: [] }
                }
            ]
        },
        ListeCours: listeCours,
    };
};