import type { BunRequest } from "bun";

export async function handleAppelPolling(req: BunRequest): Promise<Response> {
    try {
        const body = (await req.json()) as { nom: string; [key: string]: any };
        const responseEnvelope = {
            ...body,
            dataSec: {
                data: {}
            }
        }
        await new Promise(resolve => setTimeout(resolve, 120000));
        return Response.json(responseEnvelope);
    } catch (err: any) {
        console.error("[RPC Error]", err);
        return Response.json({ Erreur: err.message }, { status: 500 });
    }
}