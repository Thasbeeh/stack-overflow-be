import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionCommentsRepository } from './question-comments.repository';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';

@Injectable()
export class QuestionCommentsService {
    constructor(private repo: QuestionCommentsRepository){}

    async findAllQuestionComments(questionId: string){
        const comments = await this.repo.findAllQuestionComments(questionId);
        if(comments.length) {
            throw new NotFoundException('No comment found');
        }

        return comments;
    }

    async commentOnQuestion(questionId: string, content: string, author: CurrentUserType){
        return this.repo.createQuestionComment(questionId, content, author.userId)
    }

    async updateQuestionComment(id: string, content: string, currentUser: CurrentUserType){
        const result = await this.repo.updateQuestionComment(id, content, currentUser.userId);
        if(result.count === 0){
            throw new ForbiddenException('Cannot edit comment: Comment not found or not owner');
        }

        return result;
    }

    async deleteUniqueQuestionComment(id: string, currentUser: CurrentUserType){
        const result = await this.repo.softDeleteUniqueQuestionComment(id, currentUser.userId);
        if(result.length){
            throw new ForbiddenException('User forbidden request');
        }

        return result;
    }
}
