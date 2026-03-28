import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { VoteStrategy } from "./vote-strategy";
import { QuestionVotesRepository } from "src/votes/repositories/question-votes.repository";
import { VoteValue } from "../dtos/vote-info-dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class QuestionVoteStrategy implements VoteStrategy {
    constructor(
        private prisma: PrismaService,
        private repo: QuestionVotesRepository,
    ) {}

    async castVote(questionId: string, userId: string, newValue: VoteValue) {
        return this.prisma.$transaction(async (tx) => {
            const question = await this.repo.findUniqueVoteQuestion(questionId, tx);
            if (!question || question.deletedAt) throw new NotFoundException('Question not found');
            if (question.authorId === userId) throw new ForbiddenException('Voting on own question');

            const existing = await this.repo.findExistingVoteValue(questionId, userId, tx);
            const oldValue = existing?.value ?? 0;

            if (oldValue === newValue) {
                return {
                    myVote: oldValue,
                    totalVotes: question.voteCount
                };
            }

            const delta = newValue - oldValue;
            if (newValue === 0) {
                if (existing) await this.repo.unVoteQuestion(questionId, userId, tx);
            }
            else await this.repo.voteQuestion(questionId, userId, newValue, tx);

            const updated = await this.repo.updateQuestionVoteCount(questionId, delta, tx);

            return {
                myVote: newValue,
                totalVotes: updated.voteCount
            };
        });
    }
}