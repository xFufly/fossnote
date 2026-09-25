import { db } from "./src/db";
import { grades, evaluations, subjects, students } from "./src/db/schema";
import { eq, desc } from "drizzle-orm";

async function test() {
    const studentId = 1; // akaty
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId)
    });
    console.log(student?.classId);
    
    if (student?.classId) {
        const allGrades = await db
            .select({
                studentId: grades.studentId,
                gradeValue: grades.grade,
                isAbsent: grades.isAbsent,
                isExempted: grades.isExempted,
                outOf: evaluations.outOf,
                coefficient: evaluations.coefficient,
                subjectName: subjects.name,
            })
            .from(grades)
            .innerJoin(evaluations, eq(grades.evaluationId, evaluations.id))
            .innerJoin(subjects, eq(evaluations.subjectId, subjects.id))
            .innerJoin(students, eq(grades.studentId, students.id))
            .where(eq(students.classId, student.classId));
            
        console.log(`Found ${allGrades.length} grades for class ${student.classId}`);
    }
}
test();
