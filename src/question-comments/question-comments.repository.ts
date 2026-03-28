import { Injectable } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientLike } from "src/types/prisma-client.type";

@Injectable()
export class QuestionCommentsRepository{
    constructor(private prisma: PrismaService){}
    
    findAllQuestionComments(questionId: string){
        return this.prisma.questionComment.findMany({
            where: {
                questionId,
                deletedAt: null,
            }
        })
    }

    createQuestionComment(questionId: string, content: string, authorId: string){
        return this.prisma.questionComment.create({
            data: {
                questionId,
                content,
                authorId,
            }
        })
    }

    updateQuestionComment(id: string, content: string, currentUserId: string){
        return this.prisma.questionComment.updateMany({
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

    softDeleteUniqueQuestionComment(id: string, currentUserId: string){
        return this.prisma.questionComment.updateManyAndReturn({
            where: {
                id,
                authorId: currentUserId,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                deletedById: currentUserId,
            }
        });
    }
}