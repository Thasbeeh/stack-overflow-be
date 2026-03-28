import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AnswersRepository } from './answers.repository';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { EditAnswerDto } from './dtos/edit-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswersService {
    constructor(
        private repo: AnswersRepository,
        private prisma: PrismaService,
    ){}

    createAnswer(questionId: string, content: string, currentUser: CurrentUserType){
        return this.repo.createAnswer(questionId, content, currentUser.userId);
    }

    async getAnswersByQuestion(questionId: string){
        const answers = await this.repo.findAllQuestionAnswers(questionId);
        if(!answers.length) throw new NotFoundException('Question not answered');

        return answers;
    }

    async updateAnswer(id: string, attrs: Partial<EditAnswerDto>, currentUser: CurrentUserType){
        const result = await this.repo.updateAnswer(id, currentUser.userId, attrs);
        if (result.count === 0){
            const exists = await this.repo.countAnswersForEdit(id);
            if(exists === 0) throw new NotFoundException('Answer not found');

            throw new ForbiddenException('Not owner of answer')
        }

        return result;
    }

    async deleteAnswer(id: string, currentUser: CurrentUserType){
        return this.prisma.$transaction(async tx => {
            const answer = await this.repo.getAnswerForDelete(id, tx);
            if(!answer || answer.deletedAt) throw new NotFoundException('Question Not Found');

            const isAuthor: boolean = answer.authorId === currentUser.userId
            const isAdmin: boolean = currentUser.role === 'ADMIN';
            const canDeleteAnswer = isAdmin || (isAuthor && answer.acceptedIn === null);

            if (!canDeleteAnswer) {
                throw new ForbiddenException(
                    isAuthor
                    ? 'Author cannot delete a answer with an accepted answer'
                    : 'You are not allowed to delete this answer'
                );
            }
            
            return this.repo.softDeleteAnswerCommentsVotes(id, currentUser.userId, tx);
        })
    }
}