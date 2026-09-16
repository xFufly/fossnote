import { db } from "../../../db";
import { students } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { RpcContext } from "../../types";

export const handleStudentPrivateInfo = async (_body: any, ctx: RpcContext) => {
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

    return {
        "Informations": {
            "adresse1": student.address_line1,
            "adresse2": student.address_line2,
            "adresse3": "",
            "adresse4": "",
            "codePostal": student.postalCode,
            "ville": student.city,
            "province": student.state,
            "pays": student.country,
            "eMail": student.email,
            "telephonePortable": student.phoneNumber,
            "indicatifTel": "",
            "numeroINE": student.ine
        }
    };
}