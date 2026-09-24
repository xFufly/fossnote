import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
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

export const rooms = sqliteTable("rooms", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    capacity: integer("capacity"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const lessons = sqliteTable("lessons", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    classId: integer("class_id").references(() => classes.id),
    groupId: integer("group_id").references(() => groups.id),
    subjectId: integer("subject_id").notNull().references(() => subjects.id),
    teacherId: integer("teacher_id").notNull().references(() => teachers.id),
    roomId: integer("room_id").references(() => rooms.id),
    date: text("date").notNull(), // YYYY-MM-DD HH:MM:SS
    startSlot: integer("start_slot").notNull(), // Place in the week grid
    duration: integer("duration").notNull().default(2), // Duration in slots (e.g. 2 = 1 hour)
    isCancelled: integer("is_cancelled", { mode: "boolean" }).notNull().default(false),
    status: text("status"), // e.g. "Prof. absent"
    hexColor: text("hex_color").notNull().default("#E0E5A4"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
    id: integer("id").primaryKey(),
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

export const postits = sqliteTable("postits", {
    userId: integer("user_id").notNull(),
    userType: integer("user_type").notNull(), // 1 for teacher, 3 for student...
    content: text("content").notNull(),
    hexColor: text("hex_color").notNull().default("#F49737"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (t) => [
    primaryKey({ columns: [t.userId, t.userType] }),
]);

export const news = sqliteTable("news", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull().default(""),
    category: text("category").notNull().default("Divers"), // nature.V.L (Divers, etc.)
    isInformation: integer("is_information", { mode: "boolean" }).notNull().default(true), // estInformation
    isSurvey: integer("is_survey", { mode: "boolean" }).notNull().default(false), // estSondage
    hasAttachments: integer("has_attachments", { mode: "boolean" }).notNull().default(false), // informationListeContenu.avecPJ
    author: text("author"), // auteur
    targetUserType: integer("target_user_type"),
    startDate: text("start_date"), // dateDebut (YYYY-MM-DD)
    endDate: text("end_date"), // dateFin (YYYY-MM-DD)
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const surveyQuestions = sqliteTable("survey_questions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    newsId: integer("news_id").notNull().references(() => news.id, { onDelete: "cascade" }),
    title: text("title").notNull().default(""),
    text: text("text").notNull(),
    rank: integer("rank").notNull().default(1),
    responseType: integer("response_type").notNull().default(2), // genreReponse
    responseSize: integer("response_size").notNull().default(200), // tailleReponse
    hasMaximum: integer("has_maximum", { mode: "boolean" }).notNull().default(false), // avecMaximum
    maxAnswers: integer("max_answers").notNull().default(0), // nombreReponsesMax
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const surveyPossibleAnswers = sqliteTable("survey_possible_answers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id").notNull().references(() => surveyQuestions.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    rank: integer("rank").notNull().default(1),
    isFreeText: integer("is_free_text", { mode: "boolean" }).notNull().default(false), // estReponseLibre
});

export const surveyUserAnswers = sqliteTable("survey_user_answers", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id").notNull().references(() => surveyQuestions.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull(),
    userType: integer("user_type").notNull(),
    selectedAnswerId: integer("selected_answer_id").references(() => surveyPossibleAnswers.id, { onDelete: "cascade" }), // Nullable if the user provided a free text response
    freeTextResponse: text("free_text_response"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

import { relations } from "drizzle-orm";

export const newsRelations = relations(news, ({ many }) => ({
    surveyQuestions: many(surveyQuestions),
}));

export const surveyQuestionsRelations = relations(surveyQuestions, ({ one, many }) => ({
    news: one(news, {
        fields: [surveyQuestions.newsId],
        references: [news.id],
    }),
    possibleAnswers: many(surveyPossibleAnswers),
    userAnswers: many(surveyUserAnswers),
}));

export const surveyPossibleAnswersRelations = relations(surveyPossibleAnswers, ({ one }) => ({
    question: one(surveyQuestions, {
        fields: [surveyPossibleAnswers.questionId],
        references: [surveyQuestions.id],
    }),
}));

export const surveyUserAnswersRelations = relations(surveyUserAnswers, ({ one }) => ({
    question: one(surveyQuestions, {
        fields: [surveyUserAnswers.questionId],
        references: [surveyQuestions.id],
    }),
    selectedAnswer: one(surveyPossibleAnswers, {
        fields: [surveyUserAnswers.selectedAnswerId],
        references: [surveyPossibleAnswers.id],
    }),
}));

export type Subject = InferSelectModel<typeof subjects>;
export type NewSubject = InferInsertModel<typeof subjects>;

export type Teacher = InferSelectModel<typeof teachers>;
export type NewTeacher = InferInsertModel<typeof teachers>;

export type Class = InferSelectModel<typeof classes>;
export type NewClass = InferInsertModel<typeof classes>;

export type Student = InferSelectModel<typeof students>;
export type NewStudent = InferInsertModel<typeof students>;

export type ClassRepresentative = InferSelectModel<typeof classRepresentatives>;
export type NewClassRepresentative = InferInsertModel<typeof classRepresentatives>;

export type Group = InferSelectModel<typeof groups>;
export type NewGroup = InferInsertModel<typeof groups>;

export type GroupStudent = InferSelectModel<typeof groupStudents>;
export type NewGroupStudent = InferInsertModel<typeof groupStudents>;

export type GroupTeachersSubject = InferSelectModel<typeof groupTeachersSubjects>;
export type NewGroupTeachersSubject = InferInsertModel<typeof groupTeachersSubjects>;

export type ClassTeachersSubject = InferSelectModel<typeof classTeachersSubjects>;
export type NewClassTeachersSubject = InferInsertModel<typeof classTeachersSubjects>;

export type Evaluation = InferSelectModel<typeof evaluations>;
export type NewEvaluation = InferInsertModel<typeof evaluations>;

export type Grade = InferSelectModel<typeof grades>;
export type NewGrade = InferInsertModel<typeof grades>;

export type Homework = InferSelectModel<typeof homeworks>;
export type NewHomework = InferInsertModel<typeof homeworks>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type Postit = InferSelectModel<typeof postits>;
export type NewPostit = InferInsertModel<typeof postits>;

export type News = InferSelectModel<typeof news>;
export type NewNews = InferInsertModel<typeof news>;

export type SurveyQuestion = InferSelectModel<typeof surveyQuestions>;
export type NewSurveyQuestion = InferInsertModel<typeof surveyQuestions>;

export type SurveyPossibleAnswer = InferSelectModel<typeof surveyPossibleAnswers>;
export type NewSurveyPossibleAnswer = InferInsertModel<typeof surveyPossibleAnswers>;

export type SurveyUserAnswer = InferSelectModel<typeof surveyUserAnswers>;
export type NewSurveyUserAnswer = InferInsertModel<typeof surveyUserAnswers>;

export type Room = InferSelectModel<typeof rooms>;
export type NewRoom = InferInsertModel<typeof rooms>;

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

export const roomsRelations = relations(rooms, ({ many }) => ({
    lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
    class: one(classes, {
        fields: [lessons.classId],
        references: [classes.id],
    }),
    group: one(groups, {
        fields: [lessons.groupId],
        references: [groups.id],
    }),
    subject: one(subjects, {
        fields: [lessons.subjectId],
        references: [subjects.id],
    }),
    teacher: one(teachers, {
        fields: [lessons.teacherId],
        references: [teachers.id],
    }),
    room: one(rooms, {
        fields: [lessons.roomId],
        references: [rooms.id],
    }),
}));

/**
 * TODO : 
 * - Optionnal courses (up to 3 per student)
 * - Birth date, birth city, birth country per student and teacher
 */