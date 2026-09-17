import { db } from "../../../db";
import { classes, groups } from "../../../db/schema";
import type { RpcContext } from "../../types";

export const handleTeacherClasses = async (_body: any, ctx: RpcContext) => {
    const teacherId = ctx.session.userId;
    if (!teacherId) {
        throw new Error("Unauthorized: Teacher session lacks userId");
    }

    // 1. Fetch all classes (G: 1) ordered by name
    const allClasses = await db.query.classes.findMany({
        orderBy: (classes, { asc }) => [asc(classes.name)],
    });

    // 2. Fetch all groups (G: 2) ordered by name
    const allGroups = await db.query.groups.findMany({
        orderBy: (groups, { asc }) => [asc(groups.name)],
    });

    // 3. Construct the list of classes and groups with their respective details
    const liste: any[] = [];

    for (const c of allClasses) {
        liste.push({
            L: c.name,
            N: c.id.toString().padStart(4, "0"),
            G: 1,
        });
    }

    for (const g of allGroups) {
        liste.push({
            L: g.name,
            N: g.id.toString().padStart(4, "0"),
            G: 2,
            estGAEV: false,
        });
    }

    return {
        listeClassesGroupes: {
            _T: 24,
            V: liste,
        },
    };
};