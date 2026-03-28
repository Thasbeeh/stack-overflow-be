import { Module } from '@nestjs/common';
import { QuestionCommentsController } from './question-comments.controller';
import { QuestionCommentsService } from './question-comments.service';
import { QuestionCommentsRepository } from './question-comments.repository';

@Module({
  controllers: [QuestionCommentsController],
  providers: [QuestionCommentsService, QuestionCommentsRepository],
  exports: [QuestionCommentsRepository]
})
export class QuestionCommentsModule {}
