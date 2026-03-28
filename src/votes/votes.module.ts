import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { VoteFactory } from './vote-factory';
import { QuestionVoteStrategy } from './strategies/question-vote-strategy';
import { AnswerVoteStrategy } from './strategies/answer-vote-strategy';
import { QuestionVotesRepository } from './repositories/question-votes.repository';
import { AnswerVotesRepository } from './repositories/answer-votes.repository';

@Module({
  controllers: [VotesController],
  providers: [VotesService,
    VoteFactory,
    QuestionVoteStrategy, 
    AnswerVoteStrategy,
    QuestionVotesRepository, 
    AnswerVotesRepository,
  ]
})
export class VotesModule { }
