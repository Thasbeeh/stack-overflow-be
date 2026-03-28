import { PrismaService } from "src/prisma/prisma.service";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { CurrentUser as CurrentUserType } from "src/auth/interfaces/current-user.interface";
// import { answerVotesRepository } from "src/answer-votes/answer-votes.repository";
import { QuestionsRepository } from "../questions.repository";
import { AnswersRepository } from "src/answers/answers.repository";
import { AnswerCommentsRepository } from "src/answer-comments/answer-comments.repository";

@Injectable()
export class DeleteQuestionAppService {
    constructor(
        private questionsRepo: QuestionsRepository,
        private answersRepo: AnswersRepository,
        private answerCommentsRepo: AnswerCommentsRepository,
        // private answerVotesRepo: answerVotesRepository,
        private prisma: PrismaService,
    ){}

    execute(id: string, currentUser: CurrentUserType){
        return this.prisma.$transaction(async tx => {
            const question = await this.questionsRepo.getQuestionAndAnswerIdsForDelete(id, tx);
            if(!question || question.deletedAt) throw new NotFoundException('Question Not Found');

            const isAuthor: boolean = question.authorId === currentUser.userId
            const isAdmin: boolean = currentUser.role === 'ADMIN';
            const canDeleteQuestion = isAdmin || (isAuthor && question.acceptedAnswerId === null);

            if (!canDeleteQuestion) {
                throw new ForbiddenException(
                    isAuthor
                    ? 'Author cannot delete a question with an accepted answer'
                    : 'You are not allowed to delete this question'
                );
            }

            const answerIds: string[] = question.answers.map(ans => ans.id);
            if(answerIds.length){
                await this.answersRepo.softDeleteByQuestionId(id, currentUser.userId, tx);
                await this.answerCommentsRepo.softDeleteAllAnswerComments(answerIds, currentUser.userId, tx);
                // await this.answerVotesRepo.deleteAll(answerIds, tx);
            }
            return this.questionsRepo.softDeleteQuestionCommentsVotes(id, currentUser.userId, tx);
        })
    }
}