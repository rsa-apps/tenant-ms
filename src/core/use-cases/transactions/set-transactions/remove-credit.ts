import { db } from "@/db/connection";
import { dbFunctions } from "@/db/functions";
import { audits, users, wallets } from "@/db/schema";
import { ActionsTypes } from "@/domain/enums/audit";
import { eq } from "drizzle-orm";

interface IRequest {
  responsibleId: string;
  userId: string;
  amount: number;
}

export async function removeCredit({
  responsibleId,
  userId,
  amount,
}: IRequest): Promise<void> {
  await db.transaction(async (tx) => {
    const [userData] = await tx.select({
      id: users.id,
      name: users.name,
    }).from(users).where(eq(users.id, userId))

    const [adminData] = await tx.select({
      id: users.id,
      name: users.name,
    }).from(users).where(eq(users.id, userId))

    await tx.update(wallets).set({
      credits: dbFunctions.decrement(wallets.credits, amount),
    }).where(eq(wallets.userId, userId))

    await tx.insert(audits).values({
      action: ActionsTypes.REMOVE_CREDIT,
      description: `Remove ${amount} credits to user ${userData.name} by admin ${adminData.name}`,
      responsibleId,
      affectedId: userId,
    })
  })
}