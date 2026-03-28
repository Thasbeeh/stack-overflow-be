import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientLike } from "src/types/prisma-client.type";

@Injectable()
export class QuestionsRepository {
    constructor(private prisma: PrismaService) { }

    async createQuestionWithTags(
        title: string,
        content: string,
        authorId: string,
        questionTags: string[]
    ) {
        return this.prisma.question.create({
            data: {
                title,
                content,
                authorId,
                tags: {
                    connectOrCreate: questionTags.map(name => ({
                        where: { name },
                        create: { name },
                    })),
                }
            },
            include: {
                tags: true
            },
        });
    }

    getQuestionById(
        id: string,
        db: PrismaClientLike = this.prisma
    ) {
        return db.question.findFirst({
            where: { 
                id,
                deletedAt: null
            },
            include: {
                tags: true
            }
        });
    }

    getQuestionAndAnswerIdsForDelete(
        id: string,
        db: PrismaClientLike = this.prisma
    ) {
        return db.question.findUnique({
            where: { id },
            include: {
                answers: {
                    select: {
                        id: true
                    }
                }
            }
        });
    }

    getQuestionByIdForEdit(
        id: string,
        db: PrismaClientLike = this.prisma
    ) {
        return db.question.findUnique({
            where: { id }
        });
    }

    updateQuestionWithTags(
        id: string,
        updateData: Prisma.QuestionUpdateInput,
        tags: string[],
        db: PrismaClientLike = this.prisma
    ) {
        return db.question.update({
            where: { id },
            data: {
                ...updateData,
                tags: {
                    set: [],
                    connectOrCreate: tags?.map(name => ({
                        where: { name },
                        create: { name },
                    }))
                }
            },
            include: {
                tags: true
            }
        });
    }

    updateQuestionWithoutTags(
        id: string,
        updateData: Prisma.QuestionUpdateInput,
        db: PrismaClientLike = this.prisma
    ) {
        return db.question.update({
            where: { id },
            data: {
                ...updateData,
            },
            include: {
                tags: true
            }
        });
    }

    deleteQuestion(id: string, deletedById: string, db: PrismaClientLike = this.prisma) {
        return db.question.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedById,
                tags: {
                    set: [],
                }
            }
        })
    }

    acceptAnswer(
        id: string,
        acceptedAnswerId: string,
        authorId: string
    ) {
        return this.prisma.question.updateManyAndReturn({
            where: {
                id,
                authorId,
                acceptedAnswerId: null,
                deletedAt: null,
                answers: { some: { id: acceptedAnswerId } }
            },
            data: { acceptedAnswerId: acceptedAnswerId }
        });
    }

    softDeleteQuestionCommentsVotes(
        id: string,
        currentUserId: string,
        db: PrismaClientLike = this.prisma,
    ){
        return db.question.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedById: currentUserId,
                questionVotes: {
                    deleteMany: {}
                },
                questionComments: {
                    updateMany: {
                        where: { deletedAt: null },
                        data: {
                            deletedAt: new Date(),
                            deletedById: currentUserId
                        },
                    }
                },
            }
        });
    }
}