import { db } from "../../db";
import { sessions, students, teachers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { PronoteCrypto } from "../../crypto/cipher";
import type { RpcContext } from "../types";

export const handleIdentification = async (body: any, ctx: RpcContext) => {
    const identifiant: string = body.donneesSec?.donnees?.identifiant ?? "";
    const genreEspace: number = body.donneesSec?.donnees?.genreEspace ?? ctx.espaceId;
    const cleanUsername = identifiant.trim().toLowerCase();
    const sessionIdNum = parseInt(ctx.sessionId, 10);

    let currentIvHex = "00000000000000000000000000000000";
    if (ctx.session.aesKey) {
        try {
            const parsed = JSON.parse(ctx.session.aesKey);
            currentIvHex = parsed?.iv ?? currentIvHex;
        } catch {}
    }

    let targetUserId: number | null = null;
    let passwordHash: string | null = null;

    if (genreEspace === 3) {
        const student = await db.query.students.findFirst({
            where: eq(students.username, cleanUsername),
        });
        if (student) {
            targetUserId = student.id;
            passwordHash = student.passwordHash;
        }
    } else if (genreEspace === 1) {
        const teacher = await db.query.teachers.findFirst({
            where: eq(teachers.username, cleanUsername),
        });
        if (teacher) {
            targetUserId = teacher.id;
            passwordHash = teacher.passwordHash;
        }
    }

    if (!passwordHash || targetUserId === null) {
        return {
            alea: "0w0",
            modeCompMdp: 0,
            modeCompLog: 1,
            challenge: "0w0",
        };
    }

    const challenge = PronoteCrypto.generateChallenge(
        cleanUsername,
        passwordHash,
        currentIvHex
    );

    await db
        .update(sessions)
        .set({
            userId: targetUserId,
            userType: genreEspace,
            challenge: JSON.stringify(challenge),
            updatedAt: new Date(),
        })
        .where(eq(sessions.id, sessionIdNum));

    return {
        alea: challenge.alea,
        modeCompMdp: 0,
        modeCompLog: 1,
        challenge: challenge.challenge,
    };
};