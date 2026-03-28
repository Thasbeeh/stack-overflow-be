import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AnswerCommentsService } from './answer-comments.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from 'src/auth/interfaces/current-user.interface';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateAnswerCommentDto } from './dtos/update-answer-comment.dto';

@Controller('/answers')
export class AnswerCommentsController {
    constructor(private readonly answerCommentsService: AnswerCommentsService) {}

    @Get('/:answerId/comments')
    getCommentsForAnswer(@Param('answerId') answerId: string){
        return this.answerCommentsService.findAllAnswerComments(answerId);
    }

    @Post('/:answerId/comments')
    commentOnAnswer(
        @Param('answerId') answerId: string,
        @Body() Body: CreateCommentDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.answerCommentsService.commentOnAnswer(answerId, Body.content, currentUser);
    }

    @Patch('/:commentId')
    updateAnswerComment(
        @Param('commentId') commentId: string,
        @Body() body: UpdateAnswerCommentDto,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.answerCommentsService.updateAnswerComment(commentId, body.content, currentUser)
    }

    @Delete('/:answerId/comments/:commentId')
    deleteUniqueAnswerComment(
        @Param('commentId') commentId: string,
        @CurrentUser() currentUser: CurrentUserType,
    ){
        return this.answerCommentsService.deleteUniqueAnswerComment(commentId, currentUser)
    }
}
