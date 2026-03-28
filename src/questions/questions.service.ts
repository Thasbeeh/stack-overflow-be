import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository';
import { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { UpdateQuestionDto } from './dtos/update-question-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionsService {
    constructor(
        private repo: QuestionsRepository,
        private prisma: PrismaService,
    ) {}

    createQuestion(title: string, content: string, author: CurrentUserType, tags: string[]){
        const questionTags = tags.map(name => name.toLowerCase().trim());
        return this.repo.createQuestionWithTags(title, content, author.userId, questionTags);
    }

    async findUniqueById(id: string){
        const question = await this.repo.getQuestionById(id);
        if(!question) throw new NotFoundException('Question not found');

        return question;
    }

    async acceptAnswer(questionId: string, answerId: string, currentUser: CurrentUserType) {
        const result = await this.repo.acceptAnswer(
            questionId,
            answerId,
            currentUser.userId
        );

        if (result.length === 0) {
            throw new ForbiddenException(
                'Cannot accept answer: not owner, already accepted, or invalid answer',
            );
        }

        return result;
    }

    updateQuestion(id: string, attrs: Partial<UpdateQuestionDto>, currentUser: CurrentUserType){
        return this.prisma.$transaction(async tx => {
            const question = await this.repo.getQuestionByIdForEdit(id, tx);
            if (!question || question.deletedAt) throw new NotFoundException('Question not found');
            if (question.authorId !== currentUser.userId) throw new ForbiddenException('Not owner of the question');
            
            const { tags, ...rest } = attrs;
            const hasScalarUpdates = Object.keys(rest).length > 0;
            const hasTagUpdates = tags !== undefined;

            if (!hasScalarUpdates && !hasTagUpdates) throw new BadRequestException('No fields to update');
            if(hasTagUpdates) return this.repo.updateQuestionWithTags(id, rest, tags, tx);
            
            return this.repo.updateQuestionWithoutTags(id, rest, tx);
        })
    }
}