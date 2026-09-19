import { db } from "../../../db";
import { teachers } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type { RpcContext } from "../../types";

export const handleTeacherPrivateInfo = async (_body: any, ctx: RpcContext) => {
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

    return {
        "Informations": {
            "adresse1": teacher.address_line1,
            "adresse2": teacher.address_line2,
            "adresse3": "",
            "adresse4": "",
            "codePostal": teacher.postalCode,
            "ville": teacher.city,
            "province": teacher.state,
            "pays": teacher.country,
            "eMail": teacher.email,
            "telephonePortable": teacher.phoneNumber,
            "indicatifTel": ""
        }
    };
}