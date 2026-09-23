import { postits } from "../../db/schema";
import { db } from "../../db";
import { eq, and } from "drizzle-orm";

export const handleSaisiePostit = async (body: any, ctx: any) => {
    const { userId, userType } = ctx.session;
    if (!userId || !userType) {
        throw new Error("Unauthorized: Session lacks userId or userType");
    }

    const content = body.dataSec.data.penseBete;

    // Check if a post-it already exists for this user
    const existingPostit = await db.query.postits.findFirst({
        where: and(eq(postits.userId, userId), eq(postits.userType, userType)),
    });

    if (existingPostit) {
        // Update the existing post-it
        await db.update(postits)
            .set({ content, updatedAt: new Date() })
            .where(and(eq(postits.userId, userId), eq(postits.userType, userType)));
    } else {
        // Insert a new post-it
        await db.insert(postits).values({
            userId,
            userType,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    return {};
}