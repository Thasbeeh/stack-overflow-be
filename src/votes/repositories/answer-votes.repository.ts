import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AnswerVotesRepository{
    constructor(private prisma: PrismaService) {}

    async findExistingVoteValue(answerId: string, userId: string, db: Prisma.TransactionClient){
        const result = await db.$queryRaw<{ value: number }[]>`
            SELECT "value"
            FROM "QuestionVote"
            WHERE "questionId" = ${answerId}
              AND "userId" = ${userId}
            FOR UPDATE
        `;

        return result[0] ?? null;
    }

    unVoteQuestion(answerId: string, userId: string, db: Prisma.TransactionClient){
        return db.answerVote.delete({
          where: {
            userId_answerId: { userId, answerId }
          }
        });
    }

    voteQuestion(answerId: string, userId, value: number, db: Prisma.TransactionClient){
        return db.answerVote.upsert({
            where: {
                userId_answerId: {
                    userId,
                    answerId
                },
            },
            create: {
                userId,
                answerId,
                value
            },
            update: {
                value
            }
        })
    }

    updateAnswerVoteCount(id: string, totalVoteChange: number, prisma: Prisma.TransactionClient){
        return prisma.answer.update({
            where: { id },
            data: { voteCount: { increment: totalVoteChange } },
            select: {
                voteCount: true
            }
        })
    }

    async findUniqueVoteAnswer(answerId: string, db: Prisma.TransactionClient){
        const result = await db.$queryRaw<{
            id: string,
            authorId: string,
            deletedAt: Date | null,
            voteCount: number,
        }[]>`
            SELECT "id", "authorId", "deletedAt", "voteCount"
            FROM "Question"
            WHERE "id" = ${answerId}
            FOR UPDATE
        `;

        return result[0] ?? null;
    }
}