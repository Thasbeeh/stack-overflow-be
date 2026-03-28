import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class QuestionVotesRepository{
    async findExistingVoteValue(questionId: string, userId: string, db: Prisma.TransactionClient){
        const result = await db.$queryRaw<{ value: number }[]>`
            SELECT "value"
            FROM "QuestionVote"
            WHERE "questionId" = ${questionId}
              AND "userId" = ${userId}
            FOR UPDATE
        `;

        return result[0] ?? null;
    }

    unVoteQuestion(questionId: string, userId: string, db: Prisma.TransactionClient){
        return db.questionVote.delete({
          where: {
            userId_questionId: { userId, questionId }
          }
        });
    }

    voteQuestion(questionId: string, userId: string, value: number, db: Prisma.TransactionClient){
        return db.questionVote.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            },
            create: {
                userId,
                questionId,
                value
            },
            update: {
                value
            }
        })
    }

    updateQuestionVoteCount(id: string, totalVoteChange: number, db: Prisma.TransactionClient){
        return db.question.update({
            where: { id },
            data: { voteCount: { increment: totalVoteChange }  },
            select: {
                voteCount: true
            }
        })
    }

    async findUniqueVoteQuestion(questionId: string, db: Prisma.TransactionClient){
        const result = await db.$queryRaw<{
            id: string,
            authorId: string,
            deletedAt: Date | null,
            voteCount: number,
        }[]>`
            SELECT "id", "authorId", "deletedAt", "voteCount"
            FROM "Question"
            WHERE "id" = ${questionId}
            FOR UPDATE
        `;

        return result[0] ?? null;
    }
}