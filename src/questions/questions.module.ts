import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './questions.repository';
import { AnswersModule } from 'src/answers/answers.module';
import { TagsModule } from 'src/tags/tags.module';
import { DeleteQuestionAppService } from './orchestrators/delete-question-app.service';
import { QuestionCommentsModule } from 'src/question-comments/question-comments.module';
import { AnswerCommentsModule } from 'src/answer-comments/answer-comments.module';

@Module({
  imports: [AnswersModule,
    QuestionCommentsModule,
    AnswerCommentsModule, 
    TagsModule,
  ],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    QuestionsRepository,
    DeleteQuestionAppService,
  ],
  exports:[QuestionsService]
})
export class QuestionsModule {}
