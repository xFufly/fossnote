import { db } from "../db";
import { sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { PronoteCrypto } from "../crypto/cipher";
import { dispatchRpc } from "../rpc/dispatcher";
import type { BunRequest } from "bun";
import rsaConfig from "../../config/rsa.json";

export async function handleAppelFonction(req: BunRequest): Promise<Response> {
    try {
        const body = (await req.json()) as { nom: string; [key: string]: any };

        const { espace_id, session_id, numero_ordre } = req.params as {
            espace_id: string;
            session_id: string;
            numero_ordre: string;
        };

        const numSessionId = parseInt(session_id, 10);
        if (Number.isNaN(numSessionId)) {
            return new Response("Invalid session ID", { status: 400 });
        }

        const currentSession = await db.query.sessions.findFirst({
            where: and(
                eq(sessions.id, numSessionId),
                gt(sessions.expiresAt, new Date())
            ),
        });

        if (!currentSession) {
            return new Response("Session expirée ou invalide", { status: 403 });
        }

        let keyHex: string;
        let currentIvHex: string | null = null;

        if (currentSession.aesKey) {
            try {
                const parsed = JSON.parse(currentSession.aesKey);
                keyHex = typeof parsed === "object" && parsed !== null ? parsed.key : parsed;
                currentIvHex = parsed?.iv ?? null;
            } catch {
                keyHex = currentSession.aesKey;
            }
        } else {
            keyHex = "";
        }

        const key = Buffer.from(keyHex, "hex");
        
        const incomingIv = currentIvHex ? Buffer.from(currentIvHex, "hex") : Buffer.alloc(16, 0);

        const decryptedOrderStr = PronoteCrypto.decryptAES(numero_ordre, key, incomingIv);
        const decryptedOrder = parseInt(decryptedOrderStr, 10);

        if (decryptedOrder !== currentSession.orderNumber + 1) {
            console.warn(`[Sync Error] Invalid order number for ${session_id}`);
            return new Response("Session desynchronization", { status: 400 });
        }

        const privateKeyPem = currentSession.privateKeyPem ?? rsaConfig.privateKeyPem;
        const incomingUuid = body.donneesSec?.donnees?.Uuid || body.dataSec?.data?.Uuid;
        
        let outgoingIvHex: string | null = currentIvHex;

        if (incomingUuid) {
            outgoingIvHex = PronoteCrypto.deriveIvFromRsa(incomingUuid, privateKeyPem);
            
            await db
                .update(sessions)
                .set({
                    aesKey: JSON.stringify({
                        key: keyHex,
                        iv: outgoingIvHex,
                    }),
                })
                .where(eq(sessions.id, numSessionId));
        }

        const outgoingIv = outgoingIvHex ? Buffer.from(outgoingIvHex, "hex") : incomingIv;

        const nom = body.nom || body.id;
        const ctx = {
            espaceId: parseInt(espace_id, 10),
            sessionId: numSessionId.toString(),
            session: currentSession,
            decryptedOrder,
        };

        const resultData = await dispatchRpc(nom, body, ctx);

        const responseOrder = decryptedOrder + 1;

        await db
            .update(sessions)
            .set({ orderNumber: responseOrder })
            .where(eq(sessions.id, numSessionId));

        const nextOrderEncrypted = PronoteCrypto.encryptAES(
            responseOrder.toString(),
            key,
            outgoingIv
        );

        console.log({
            order: responseOrder.toString(),
            key,
            outgoingIv,
            incomingIv,
        });

        const keyNom = body.nom ? 'nom' : 'id';
        const keyNumeroOrdre = body.nom ? 'numeroOrdre' : 'no';
        const keyDonneesSec = body.nom ? 'donneesSec' : 'dataSec';
        const keyData = body.nom ? 'donnees' : 'data';

        const responseEnvelope = {
            session: numSessionId,
            [keyNumeroOrdre]: nextOrderEncrypted,
            [keyDonneesSec]: {
                [keyNom]: nom,
                [keyData]: resultData,
                Signature: {
                    ModeExclusif: false
                },
            },

			[keyNom]: nom,
        };

        return Response.json(responseEnvelope);
    } catch (err: any) {
        console.error("[RPC Error]", err);
        return Response.json({ Erreur: err.message }, { status: 500 });
    }
}