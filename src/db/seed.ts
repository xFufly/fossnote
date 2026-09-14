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
}

seed();