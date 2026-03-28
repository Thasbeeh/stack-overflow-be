import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser} from 'src/auth/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { CreateCommentDto } from './dtos/create-question-comment.dto';
import { QuestionCommentsService } from './question-comments.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QuestionCommentDto } from './dtos/question-comment.dto';
import { UpdateQuestionCommentDto } from './dtos/update-question-comment.dto';

@Serialize(QuestionCommentDto)
@Controller('/questions/:questionId/comments')
export class QuestionCommentsController {
    constructor(private questionCommentsService: QuestionCommentsService){}

    @Get()
    getCommentsForQuestion(@Param('questionId') questionId: string){
        return this.questionCommentsService.findAllQuestionComments(questionId);
    }

    @Post()
    commentOnQuestion(
        @Param('questionId') questionId: string,
        @Body() Body: CreateCommentDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.questionCommentsService.commentOnQuestion(questionId, Body.content, currentUser);
    }

    @Patch('/:commentId')
    updateQuestionComment(
        @Param('commentId') commentId: string,
        @Body() body: UpdateQuestionCommentDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.questionCommentsService.updateQuestionComment(commentId, body.content, currentUser)
    }

    @Delete('/:commentId')
    deleteUniqueQuestionComment(
        @Param('commentId') commentId: string,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.questionCommentsService.deleteUniqueQuestionComment(commentId, currentUser)
    }
}
