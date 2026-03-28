import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AnswerDto } from './dtos/answer.dto';
import { AnswersService } from './answers.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { EditAnswerDto } from './dtos/edit-answer.dto';

@Controller()
export class AnswersController {
    constructor(private answersService: AnswersService) {}

    @Serialize(AnswerDto)
    @Post('questions/:questionId/answers')
    createAnswer(
        @Param('questionId') questionId: string,
        @Body() body: CreateAnswerDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.answersService.createAnswer(questionId, body.content, currentUser);
    }

    @Serialize(AnswerDto)
    @Get('questions/:questionId/answers')
    getAnswersByQuestion(@Param('questionId') questionId: string){
        return this.answersService.getAnswersByQuestion(questionId);
    }

    @Patch('answers/:id')
    updateAnswer(
        @Param('id') id: string,
        @Body() body: Partial<EditAnswerDto>,
        @CurrentUser() currentUser: CurrentUserType,
    ) {
        return this.answersService.updateAnswer(id, body, currentUser)
    }

    @Delete('answers/:id')
    deleteAnswer(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType){
        this.answersService.deleteAnswer(id, currentUser);
    }
}
