import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { UpdateQuestionDto } from './dtos/update-question-dto';
import { DeleteQuestionAppService } from './orchestrators/delete-question-app.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QuestionDto } from './dtos/question.dto';
import { AnswerDto } from 'src/answers/dtos/answer.dto';

@Controller('questions')
export class QuestionsController {
    constructor(
        private questionsService: QuestionsService,
        private deleteQuestionApp: DeleteQuestionAppService,
    ){}
    
    @Serialize(QuestionDto)
    @Post()
    createQuestion(@Body() body: CreateQuestionDto, @CurrentUser() author: CurrentUserType) {
        return this.questionsService.createQuestion(body.title, body.content, author, body.tags);
    }
    
    @Serialize(QuestionDto)
    @Get('/:id')
    getQuestionById(@Param('id') id: string){
        return this.questionsService.findUniqueById(id);
    }
    
    @Serialize(QuestionDto)
    @Patch('/:id')
    editQuestion(
        @Param('id') id: string,
        @Body() body: Partial<UpdateQuestionDto>,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.questionsService.updateQuestion(id, body, currentUser);
    }
    
    @Delete('/:id')
    deleteQuestion(@Param('id') id: string, @CurrentUser() currentUser: CurrentUserType){
        return this.deleteQuestionApp.execute(id, currentUser);
    }

    @Serialize(AnswerDto)
    @Post('/:questionId/accept-answer/:answerId')
    acceptAnswer(
        @Param('questionId') questionId: string,
        @Param('answerId') answerId: string,
        @CurrentUser() currentUser: CurrentUserType,
    ) {
        return this.questionsService.acceptAnswer(questionId, answerId, currentUser)
    }
}