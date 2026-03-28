import { Module } from '@nestjs/common';
import { AnswerCommentsController } from './answer-comments.controller';
import { AnswerCommentsService } from './answer-comments.service';
import { AnswerCommentsRepository } from './answer-comments.repository';

@Module({
  controllers: [AnswerCommentsController],
  providers: [AnswerCommentsService, AnswerCommentsRepository],
  exports: [AnswerCommentsRepository]
})
export class AnswerCommentsModule {}
