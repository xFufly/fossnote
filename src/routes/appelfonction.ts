import { db } from "../db";
import { sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { PronoteCrypto } from "../crypto/cipher";
import { dispatchRpc } from "../rpc/dispatcher";
import type { BunRequest } from "bun";

export async function handleAppelFonction(req: BunRequest): Promise<Response> {
	try {
		const { espace_id, session_id, numero_ordre } = req.params as {
			espace_id: string;
			session_id: string;
			numero_ordre: string;
		};

		// 1. Recovery of the session from the database
		const currentSession = await db.query.sessions.findFirst({
			where: and(
				eq(sessions.id, session_id),
				gt(sessions.expiresAt, new Date())
			),
		});

		if (!currentSession) {
			return new Response("Session expirée ou invalide", { status: 403 });
		}

        let keyHex: string;
        let ivHex: string | null = null;

        if (currentSession.aesKey) {
            try {
                const parsed = JSON.parse(currentSession.aesKey);
                keyHex = typeof parsed === "object" && parsed !== null ? parsed.key : parsed;
                ivHex = parsed?.iv ?? null;
            } catch {
                keyHex = currentSession.aesKey;
            }
        } else {
            keyHex = "";
        }

        const key = Buffer.from(keyHex, "hex");
        const iv = ivHex ? Buffer.from(ivHex, "hex") : null;

		// 2. Validation of the order number
		const decryptedOrderStr = PronoteCrypto.decryptAES(numero_ordre, key, iv);
		const decryptedOrder = parseInt(decryptedOrderStr, 10);

		if (decryptedOrder !== currentSession.orderNumber + 1) {
			console.warn(`[Sync Error] Numéro d'ordre invalide pour ${session_id}`);
			return new Response("Désynchronisation de session", { status: 400 });
		}

		// Update the order number in the database for the next expected request
		await db
			.update(sessions)
			.set({ orderNumber: currentSession.orderNumber + 2 })
			.where(eq(sessions.id, session_id));

		// 3. Parse the request body and dispatch the RPC call
		const body = (await req.json()) as { nom: string; [key: string]: any };
		const nom = body.nom;

		const ctx = {
			espaceId: parseInt(espace_id, 10),
			sessionId: session_id,
			session: currentSession,
			decryptedOrder,
		};

		// 4. Dispatch the RPC call to the appropriate handler based on the espaceId and nom
		const resultData = await dispatchRpc(nom, body, ctx);

		// 5. Encrypt the next order number for the response
		const nextOrderEncrypted = PronoteCrypto.encryptAES(
			(currentSession.orderNumber + 2).toString(),
			key,
			iv
		);

		const responseEnvelope = {
			nom,
			session: parseInt(session_id, 10) || session_id,
			numeroOrdre: nextOrderEncrypted,
			donneesSec: {
				nom,
				donnees: resultData,
			},
		};

		return Response.json(responseEnvelope);
	} catch (err: any) {
		console.error("[RPC Error]", err);
		return Response.json({ Erreur: err.message }, { status: 500 });
	}
}