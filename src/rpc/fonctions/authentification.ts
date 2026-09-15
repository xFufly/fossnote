import { db } from "../../db";
import { sessions, students, teachers } from "../../db/schema";
import { eq } from "drizzle-orm";
import { PronoteCrypto } from "../../crypto/cipher";
import type { RpcContext } from "../types";

function getPronoteDateString(d = new Date()): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export const handleAuthentification = async (body: any, ctx: RpcContext) => {
    const sessionIdNum = parseInt(ctx.sessionId, 10);
    const requestedChallenge: string = body.donneesSec?.donnees?.challenge ?? "";

    if (!ctx.session.challenge) {
        return { Acces: 1 };
    }

    let challengeInfos: {
        solved: string;
        key: string;
        username: string;
    };

    try {
        challengeInfos = JSON.parse(ctx.session.challenge);
    } catch {
        return { Acces: 1 };
    }

    if (challengeInfos.solved !== requestedChallenge) {
        return { Acces: 1 };
    }

    let currentIvHex = "00000000000000000000000000000000";
    if (ctx.session.aesKey) {
        try {
            const parsed = JSON.parse(ctx.session.aesKey);
            currentIvHex = parsed?.iv ?? currentIvHex;
        } catch {}
    }

    let fullName = "";
    const cleanUsername = challengeInfos.username.toLowerCase();

    if (ctx.espaceId === 3) {
        const student = await db.query.students.findFirst({
            where: eq(students.username, cleanUsername),
        });
        if (student) {
            fullName = `${student.lastName.toUpperCase()} ${student.firstName}`;
        }
    } else if (ctx.espaceId === 1) {
        const teacher = await db.query.teachers.findFirst({
            where: eq(teachers.username, cleanUsername),
        });
        if (teacher) {
            fullName = `${teacher.lastName.toUpperCase()} ${teacher.firstName}`;
        }
    }

    const finalKeyData = PronoteCrypto.generateFinalKey(challengeInfos.key, currentIvHex);

    await db
        .update(sessions)
        .set({
            aesKey: JSON.stringify({
                key: finalKeyData.solved,
                iv: currentIvHex,
            }),
            updatedAt: new Date(),
        })
        .where(eq(sessions.id, sessionIdNum));

    return {
        libelleUtil: fullName,
        cle: finalKeyData.key,
        modeSecurisationParDefaut: 3,
        derniereConnexion: {
            V: getPronoteDateString(),
            _T: 7,
        },
    };
};