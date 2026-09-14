import type { Session } from "../db";

export interface RpcContext {
    session: Session;
    numeroOrdre: number;
}

export type RpcHandler<TInput = any, TOutput = any> = (
    donnees: TInput,
    ctx: RpcContext
) => Promise<TOutput> | TOutput;