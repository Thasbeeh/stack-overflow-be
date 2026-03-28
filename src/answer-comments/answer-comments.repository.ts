import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientLike } from "src/types/prisma-client.type";

@Injectable()
export class AnswerCommentsRepository {
    constructor(private prisma: PrismaService) {}

    findAllAnswerComments(answerId: string) {
        return this.prisma.answerComment.findMany({
            where: {
                answerId,
                deletedAt: null,
            }
        })
    }

    createAnswerComment(answerId: string, content: string, authorId: string) {
        return this.prisma.answerComment.create({
            data: {
                answerId,
                content,
                authorId,
            }
        })
    }

    updateAnswerComment(id: string, content: string, currentUserId: string){
        return this.prisma.answerComment.updateMany({
            where: {    
                id,
                authorId: currentUserId,
                author: {
                    OR: [
                        { id: currentUserId },
                        { role: 'ADMIN' },
                    ]
                },
                deletedAt: null
             },
            data: { content }
        })
    }

    softDeleteUniqueAnswerComment(id: string, currentUserId: string) {
        return this.prisma.answerComment.updateManyAndReturn({
            where: {
                id,
                authorId: currentUserId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                deletedById: currentUserId,
            }
        });
    }

    softDeleteAllAnswerComments(
        answerIds: string[],
        deletedById: string,
        db: PrismaClientLike = this.prisma,
    ) {
        return db.answerComment.updateMany({
            where: {
                answerId: { in: answerIds },
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                deletedById,
            }
        })
    }
}