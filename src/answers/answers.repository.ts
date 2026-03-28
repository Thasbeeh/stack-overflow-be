import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientLike } from "src/types/prisma-client.type";

@Injectable()
export class AnswersRepository {
    constructor(private prisma: PrismaService){}

    createAnswer(questionId: string, content: string, authorId: string){
        return this.prisma.answer.create({
            data: {
                questionId,
                content,
                authorId,
            }
        })
    }

    findAllQuestionAnswers(questionId: string, db: PrismaClientLike = this.prisma){
        return db.answer.findMany({
            where: {
                questionId,
                deletedAt: null,
            },
        })
    }

    countAnswersForEdit(id: string) {
        return this.prisma.question.count({
            where: {
                id,
                deletedAt: null
            }
        });
    }

    updateAnswer(
        id: string,
        authorId: string,
        updateData: Prisma.AnswerUpdateInput,
        db: PrismaClientLike = this.prisma
    ){
        return db.answer.updateMany({
            where: {
                id,
                deletedAt: null,
                author: {
                    OR: [
                        { id: authorId },
                        { role: 'ADMIN' }
                    ]
                },
            },
            data: {
                ...updateData
            }
        })
    }

    updateVoteCount(
        id: string,
        totalVoteChange: number,
        db: PrismaClientLike = this.prisma
    ){
        return db.answer.update({
            where: { 
                id,
                deletedAt: null,
            },
            data: { 
                voteCount: { increment: totalVoteChange },
            }
        })
    }

    getAnswerForDelete(
        id: string,
        db: PrismaClientLike = this.prisma
    ) {
        return db.answer.findUnique({
            where: { id },
            include: {
                acceptedIn: true
            }
        });
    }

    softDeleteAnswerCommentsVotes(
        id: string,
        currentUserId: string,
        db: PrismaClientLike = this.prisma
    ){
        return db.answer.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedById: currentUserId,
                answerVotes: {
                    deleteMany: {}
                },
                answerComments: {
                    updateMany: {
                        where: { deletedAt: null },
                        data: {
                            deletedAt: new Date(),
                            deletedById: currentUserId
                        },
                    },
                },
            },
            select: {
                id: true
            }
        });
    }

    softDeleteByQuestionId(
        questionId: string,
        deletedById: string,
        db: PrismaClientLike = this.prisma,
    ){
        return db.answer.updateMany({
            where: {
                questionId,
                deletedAt: null,
            },
            data: { 
                deletedAt: new Date(),
                deletedById
            }
        });
    }
}