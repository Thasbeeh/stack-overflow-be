import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { AnswerCommentsRepository } from './answer-comments.repository';

@Injectable()
export class AnswerCommentsService {
    constructor(
        private readonly repo: AnswerCommentsRepository,
    ) {}

    async findAllAnswerComments(answerId: string){
        const comments = await this.repo.findAllAnswerComments(answerId);
        if(comments.length) {
            throw new NotFoundException('No comment found');
        }

        return comments;
    }

    async commentOnAnswer(answerId: string, content: string, author: CurrentUserType){
        return this.repo.createAnswerComment(answerId, content, author.userId)
    }

    async updateAnswerComment(id: string, content: string, currentUser: CurrentUserType){
        const result = await this.repo.updateAnswerComment(id, content, currentUser.userId);
        if(result.count === 0){
            throw new ForbiddenException('Cannot edit comment: Comment not found or not owner');
        }

        return result;
    }

    async deleteUniqueAnswerComment(id: string, currentUser: CurrentUserType){
        const result = await this.repo.softDeleteUniqueAnswerComment(id, currentUser.userId);
        if(result.length){
            throw new ForbiddenException('User forbidden request');
        }

        return this.repo.softDeleteUniqueAnswerComment(id, currentUser.userId);
    }
}
