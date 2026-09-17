import type { RpcContext } from "../../types";
import metadata from "../../../../config/metadata.json";
import { getCurrentPeriodKey } from "../../../helpers/date";

export const handleTeacherPeriodes = async (_body: any, ctx: RpcContext) => {
    const teacherId = ctx.session.userId;
    if (!teacherId) {
        throw new Error("Unauthorized: Teacher session lacks userId");
    }

    // 1. Define the list of periods (Trimesters and other periods)
    const listePeriodes = [
        {
            L: "Trimestre 1",
            N: "0001",
            G: 2,
            A: true,
            GenreNotation: 1,
        },
        {
            L: "Trimestre 2",
            N: "0002",
            G: 2,
            A: true,
            GenreNotation: 1,
        },
        {
            L: "Trimestre 3",
            N: "0003",
            G: 2,
            A: true,
            GenreNotation: 1,
        },
        {
            L: "Contrôle en cours de formation",
            N: "0004",
            G: 4,
            A: true,
            GenreNotation: 0,
        },
        {
            L: "Hors période",
            N: "0005",
            G: 4,
            A: true,
            GenreNotation: 0,
        },
    ];

    // 2. Determine the current period based on metadata
    let currentPeriodName = "Trimestre 1";
    let defaultPeriodId = "0001";

    if (metadata.Periodes) {
        const periodKey = getCurrentPeriodKey(metadata.Periodes);
        const configuredPeriod = metadata.Periodes[periodKey as keyof typeof metadata.Periodes];
        if (configuredPeriod?.name) {
            currentPeriodName = configuredPeriod.name;
            const matched = listePeriodes.find((p) => p.L === currentPeriodName);
            if (matched) {
                defaultPeriodId = matched.N;
            }
        }
    }

    return {
        listePeriodes: {
            _T: 24,
            V: listePeriodes,
        },
        periodeParDefaut: {
            _T: 24,
            V: {
                L: currentPeriodName,
                N: defaultPeriodId,
            },
        },
    };
};