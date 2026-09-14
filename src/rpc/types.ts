import type { Session } from "../db/schema";

export interface RpcContext {
	espaceId: number;
	sessionId: string;
	session: Session;
	decryptedOrder: number;
}

export type RpcHandler = (
	body: any,
	ctx: RpcContext
) => Promise<any> | any;