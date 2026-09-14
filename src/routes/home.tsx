import crypto from "node:crypto";
import { HomeView, type Metadata, type SessionParams } from "../../views/HomeView";
import { db } from "../db";
import { sessions } from "../db/schema";
import metadata from "../../config/metadata.json";

const DEFAULT_METADATA: Metadata = {
	title: metadata.title,
	description: metadata.description,
	creator: metadata.DC_creator,
	publisher: metadata.DC_publisher,
};

export async function handleHomeView(req: Request): Promise<Response> {
	const sessionId = crypto.randomUUID();
	const initialKey = crypto.createHash("md5").update("").digest("hex");

	const sessionParams: SessionParams = {
		h: sessionId,
		sCrA: true,
		sCoA: true,
		poll: false,
		d: false,
	};

	const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

	await db.insert(sessions).values({
		id: sessionId,
		orderNumber: 0,
		parameters: JSON.stringify(sessionParams),
		aesKey: initialKey,
		expiresAt,
	});

	const html = "<!DOCTYPE html>" + (
		<HomeView
			metadata={DEFAULT_METADATA}
			sessionParams={sessionParams}
		/>
	);

	return new Response(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "no-store, no-cache, must-revalidate",
		},
	});
}