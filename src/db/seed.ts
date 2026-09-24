import {
    Database
} from "bun:sqlite";
    
import {
    drizzle
} from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

import { db } from ".";

async function seed() {
    const [maths, techno, anglais] = await db
        .insert(schema.subjects)
        .values([{
                name: "Maths"
            },
            {
                name: "Technologie"
            },
            {
                name: "Anglais"
            }
        ])
        .returning();

    const [pgothier, lgousse] = await db
        .insert(schema.teachers)
        .values([{
                username: "pgothier",
                passwordHash: "Password123!",
                lastName: "GOTHIER",
                firstName: "Paula",
                gender: "F",
                email: "pgothier@fossnote.com",
                phoneNumber: "0676767676",
                city: "Villeurbanne"
            },
            {
                username: "lgousse",
                passwordHash: "Password123!",
                lastName: "GOUSSE",
                firstName: "Léo",
                gender: "M",
                email: "lgousse@fossnote.com",
                phoneNumber: "0766666000",
                city: "Sainte-Foy-lès-Lyon"
            }
        ])
        .returning();

    const [classe3A] = await db
        .insert(schema.classes)
        .values([{
            name: "3A",
            headTeacherId: pgothier!.id
        }])
        .returning();

    await db.insert(schema.classTeachersSubjects).values([{
            classId: classe3A!.id,
            teacherId: pgothier!.id,
            subjectId: maths!.id
        },
        {
            classId: classe3A!.id,
            teacherId: pgothier!.id,
            subjectId: techno!.id
        },
        {
            classId: classe3A!.id,
            teacherId: lgousse!.id,
            subjectId: anglais!.id
        }
    ]);

    const [akaty] = await db
        .insert(schema.students)
        .values([{
            classId: classe3A!.id,
            username: "akaty",
            passwordHash: "Password123!",
            lastName: "KATY",
            firstName: "Alex",
            gender: "M",
            email: "akaty@fossnote.com",
            phoneNumber: "0712345678",
            city: "Lyon",
            state: "Rhône-Alpes"
        }])
        .returning();

    await db.insert(schema.classRepresentatives).values({
        classId: classe3A!.id,
        studentId: akaty!.id
    });

    const [groupe1, groupe2] = await db
        .insert(schema.groups)
        .values([{
                name: "groupe1"
            },
            {
                name: "groupe2"
            }
        ])
        .returning();

    await db.insert(schema.groupStudents).values([{
            groupId: groupe1!.id,
            studentId: akaty!.id
        },
        {
            groupId: groupe2!.id,
            studentId: akaty!.id
        }
    ]);

    const [evalTrigo, evalVerbes] = await db
        .insert(schema.evaluations)
        .values([{
                teacherId: pgothier!.id,
                subjectId: maths!.id,
                classId: classe3A!.id,
                title: "Trigo n°2",
                date: "2023-06-27",
                publishingDate: "2023-06-27",
                outOf: 20,
                coefficient: 1
            },
            {
                teacherId: lgousse!.id,
                subjectId: anglais!.id,
                classId: classe3A!.id,
                title: "Verbes irréguliers",
                date: "2023-06-21",
                publishingDate: "2023-06-21",
                outOf: 20,
                coefficient: 1
            }
        ])
        .returning();

    await db.insert(schema.grades).values([{
            evaluationId: evalTrigo!.id,
            studentId: akaty!.id,
            grade: 17
        },
        {
            evaluationId: evalVerbes!.id,
            studentId: akaty!.id,
            grade: 20
        }
    ]);

    await db.insert(schema.homeworks).values({
        teacherId: pgothier!.id,
        subjectId: maths!.id,
        classId: classe3A!.id,
        title: "Devoir maison",
        description: "Exercices 2 et 3 page 255",
        givenDate: "2023-06-30",
        dueDate: "2023-06-30",
        hexColor: "#F49737",
        isLocked: false
    });

    await db.insert(schema.news).values([
        {
            title: "Réunion parents-profs",
            content: "La réunion parents-professeurs pour les classes de 3ème aura lieu ce vendredi.",
            category: "Administration",
            isInformation: true,
            isSurvey: false,
            author: "Direction",
            targetUserType: 1,
        },
        {
            title: "Fête de fin d'année",
            content: "N'oubliez pas de vous inscrire pour la fête du collège !",
            category: "Divers",
            isInformation: true,
            isSurvey: false,
            author: "Vie Scolaire",
            targetUserType: 3,
        }
    ]);
    // --- Rooms / Salles ---
    const [salle101, salle205, labo2, piscine] = await db.insert(schema.rooms).values([
        { name: "101", capacity: 30 },
        { name: "205", capacity: 30 },
        { name: "Labo 2", capacity: 20 },
        { name: "Piscine municipale", capacity: 100 },
    ]).returning();

    // --- Lessons / Cours (Full Year) ---
    // Import configuration to determine school year and holidays
    const holidays = require("../../config/constants/holidays.json");
    const metadata = require("../../config/metadata.json");

    function parseDateStr(dStr: string) {
        const [day, month, year] = dStr.split("/");
        return new Date(parseInt(year!), parseInt(month!) - 1, parseInt(day!));
    }

    const schoolYearStart = parseDateStr(metadata.Periodes.p1.from);
    const schoolYearEnd = parseDateStr(metadata.Periodes.p3.to);

    const holidayRanges = holidays.map((h: any) => ({
        start: parseDateStr(h.dateDebut.V).getTime(),
        end: parseDateStr(h.dateFin.V).getTime()
    }));

    function isHoliday(date: Date) {
        const t = date.getTime();
        return holidayRanges.some((r: any) => t >= r.start && t <= r.end);
    }

    // Generate random schedule per week
    const subjectsList = [
        { subjectId: maths!.id, teacherId: pgothier!.id, roomId: salle101!.id, hexColor: "#FF8040", duration: 2 },
        { subjectId: anglais!.id, teacherId: lgousse!.id, roomId: salle205!.id, hexColor: "#E0E5A4", duration: 2 },
        { subjectId: maths!.id, teacherId: pgothier!.id, roomId: salle101!.id, hexColor: "#FF8040", duration: 4 },
        { subjectId: techno!.id, teacherId: pgothier!.id, roomId: labo2!.id, hexColor: "#E19C84", duration: 2 }
    ];

    const slotTimes = [
        "08:10:00", "08:40:00", "09:05:00", "09:35:00", "10:15:00", "10:45:00", "11:10:00", "11:40:00",
        "12:05:00", "12:35:00", "13:00:00", "13:30:00", "13:55:00", "14:25:00", "15:05:00", "15:35:00",
        "16:00:00", "16:30:00", "16:55:00", "17:25:00"
    ];

    const lessonsToInsert = [];
    
    // Find the Monday of the week containing the school year start
    let currentMonday = new Date(schoolYearStart);
    const day = currentMonday.getDay();
    currentMonday.setDate(currentMonday.getDate() - (day === 0 ? 6 : day - 1));
    currentMonday.setHours(0, 0, 0, 0);

    let weekCounter = 0;

    while (currentMonday <= schoolYearEnd) {
        weekCounter++;
        // We will randomly assign subjects to different days and slots based on the week
        // To avoid total chaos and collisions, we just shift them by weekCounter
        
        for (let i = 0; i < subjectsList.length; i++) {
            const tmpl = subjectsList[i]!;
            
            // Randomish day (0 to 4) depending on week and subject
            const dayOffset = (i + weekCounter) % 5;
            // Randomish start slot (0 to 12) to avoid overflowing the day
            const slotOfDay = ((i * 3) + weekCounter * 2) % 13; 
            
            const lessonDate = new Date(currentMonday);
            lessonDate.setDate(currentMonday.getDate() + dayOffset);
            
            // Skip weekends (just in case) and holidays
            if (lessonDate.getDay() !== 0 && lessonDate.getDay() !== 6 && !isHoliday(lessonDate) && lessonDate >= schoolYearStart && lessonDate <= schoolYearEnd) {
                
                const dateStr = `${lessonDate.getFullYear()}-${(lessonDate.getMonth()+1).toString().padStart(2, '0')}-${lessonDate.getDate().toString().padStart(2, '0')} ${slotTimes[slotOfDay]}`;
                const place = dayOffset * 20 + slotOfDay;
                
                // Add some random cancellation for realism (about 2% of the time)
                const isCancelled = Math.random() < 0.02;
                
                lessonsToInsert.push({
                    classId: classe3A!.id,
                    subjectId: tmpl.subjectId,
                    teacherId: tmpl.teacherId,
                    roomId: tmpl.roomId,
                    date: dateStr,
                    startSlot: place,
                    duration: tmpl.duration,
                    isCancelled: isCancelled,
                    status: isCancelled ? "Prof. absent" : null,
                    hexColor: tmpl.hexColor,
                });
            }
        }
        currentMonday.setDate(currentMonday.getDate() + 7);
    }

    // Insert lessons in chunks to avoid sqlite limits
    const chunkSize = 500;
    for (let i = 0; i < lessonsToInsert.length; i += chunkSize) {
        const chunk = lessonsToInsert.slice(i, i + chunkSize);
        await db.insert(schema.lessons).values(chunk);
    }
}

seed();