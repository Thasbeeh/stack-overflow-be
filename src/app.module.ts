import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { QuestionCommentsModule } from './question-comments/question-comments.module';
import { AnswerCommentsModule } from './answer-comments/answer-comments.module';
import { TagsModule } from './tags/tags.module';
import { SearchModule } from './search/search.module';
import { VotesModule } from './votes/votes.module';
import { EmailsModule } from './emails/emails.module';
import { BullMQModule } from './infrastructure/bullmq/bullmq.module';

@Module({
  imports: [ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PrismaModule, 
    QuestionsModule,
    AnswersModule,
    QuestionCommentsModule,
    AnswerCommentsModule,
    TagsModule,
    SearchModule,
    VotesModule,
    BullMQModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
      })
    },
  ],
})
export class AppModule {
}
