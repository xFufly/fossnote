import { sqliteTable, text, integer, primaryKey, real, unique } from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable("subjects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const teachers = sqliteTable("teachers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    lastName: text("last_name").notNull(),
    firstName: text("first_name").notNull(),
    gender: text("gender"), // M or F, optional
    email: text("email"),
    phoneNumber: text("phone_number"),
    address_line1: text("address_line1"),
    address_line2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").default("France"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const classes = sqliteTable("classes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    headTeacherId: integer("head_teacher_id").references(() => teachers.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const students = sqliteTable("students", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    classId: integer("class_id").notNull().references(() => classes.id),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    lastName: text("last_name").notNull(),
    firstName: text("first_name").notNull(),
    gender: text("gender"), // M or F, optional
    email: text("email"),
    phoneNumber: text("phone_number"),
    ine: text("ine"),
    address_line1: text("address_line1"),
    address_line2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country").default("France"),
    discordId: text("discord_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const classRepresentatives = sqliteTable("class_representatives", {
    studentId: integer("student_id").notNull().references(() => students.id),
    classId: integer("class_id").notNull().references(() => classes.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
        primaryKey({ columns: [t.classId, t.studentId] }),
    ]
);

export const groups = sqliteTable("groups", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const groupStudents = sqliteTable("group_students", {
    groupId: integer("group_id").notNull().references(() => groups.id),
    studentId: integer("student_id").notNull().references(() => students.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
        primaryKey({ columns: [t.groupId, t.studentId] }),
    ]
);

export const groupTeachersSubjects = sqliteTable("group_teachers_subjects", {
    groupId: integer("group_id").notNull().references(() => groups.id),
    teacherId: integer("teacher_id").notNull().references(() => teachers.id),
    subjectId: integer("subject_id").notNull().references(() => subjects.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
        primaryKey({ columns: [t.groupId, t.teacherId, t.subjectId] }),
    ]
);

export const classTeachersSubjects = sqliteTable("class_teachers_subjects", {
    classId: integer("class_id").notNull().references(() => classes.id),
    teacherId: integer("teacher_id").notNull().references(() => teachers.id),
    subjectId: integer("subject_id").notNull().references(() => subjects.id),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
    primaryKey({ columns: [t.classId, t.teacherId, t.subjectId] }),
]);

export const evaluations = sqliteTable("evaluations", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    teacherId: integer("teacher_id").notNull().references(() => teachers.id),
    subjectId: integer("subject_id").notNull().references(() => subjects.id),
    classId: integer("class_id").references(() => classes.id),
    groupId: integer("group_id").references(() => groups.id),
    title: text("title").notNull(),
    date: text("date").notNull(), // YYYY-MM-DD
    publishingDate: text("publishing_date").notNull(), // YYYY-MM-DD
    outOf: real("out_of").notNull().default(20.0),
    coefficient: real("coefficient").notNull().default(1.0),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const grades = sqliteTable("grades", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    evaluationId: integer("evaluation_id").notNull().references(() => evaluations.id),
    studentId: integer("student_id").notNull().references(() => students.id),
    grade: real("grade"),
    isAbsent: integer("is_absent", {"mode": "boolean"}).notNull().default(false),
    isExempted: integer("is_exempted", {"mode": "boolean"}).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
        unique().on(t.evaluationId, t.studentId)
    ]
);

export const homeworks = sqliteTable("homeworks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    teacherId: integer("teacher_id").notNull().references(() => teachers.id),
    subjectId: integer("subject_id").notNull().references(() => subjects.id),
    classId: integer("class_id").references(() => classes.id),
    groupId: integer("group_id").references(() => groups.id),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: text("due_date").notNull(), // YYYY-MM-DD
    givenDate: text("given_date").notNull(), // YYYY-MM-DD
    hexColor: text("hex_color").notNull().default("#F49737"),
    isLocked: integer("is_locked", {"mode": "boolean"}).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
    id: text("id").primaryKey(), // UUID
    userId: integer("user_id"),
    userType: integer("user_type"), // 0 for teacher, 3 for student...
    orderNumber: integer("order_number").notNull().default(1),
    parameters: text("parameters"), // JSON
    privateKeyPem: text("private_key_pem"),
    aesKey: text("aes_key"),
    challenge: text("challenge"),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});