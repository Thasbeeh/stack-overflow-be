import { BadRequestException, Injectable } from "@nestjs/common";
import { VoteEntityType } from "./dtos/vote-info-dto";
import { AnswerVoteStrategy } from "./strategies/answer-vote-strategy";
import { QuestionVoteStrategy } from "./strategies/question-vote-strategy";
import { VoteStrategy } from "./strategies/vote-strategy";

@Injectable()
export class VoteFactory {
    constructor(
        private readonly questionStrategy: QuestionVoteStrategy,
        private readonly answerStrategy: AnswerVoteStrategy,
    ) {}

    getStrategy(entityType: VoteEntityType): VoteStrategy {
        switch (entityType) {
            case 'QUESTION':
                return this.questionStrategy;
            case 'ANSWER':
                return this.answerStrategy;
            default:
                throw new BadRequestException(`Voting is not supported for entity type: ${entityType}`);
        }
    }
}