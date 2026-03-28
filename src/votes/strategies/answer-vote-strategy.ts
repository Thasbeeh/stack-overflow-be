import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { VoteStrategy } from "./vote-strategy";
import { VoteValue } from "../dtos/vote-info-dto";
import { AnswerVotesRepository } from "../repositories/answer-votes.repository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AnswerVoteStrategy implements VoteStrategy {
    constructor(
        private repo: AnswerVotesRepository,
        private prisma: PrismaService,
    ) {}

    async castVote(answerId: string, userId: string, newValue: VoteValue){
        return this.prisma.$transaction(async (tx) => {
            const question = await this.repo.findUniqueVoteAnswer(answerId, tx);
            if (!question || question.deletedAt) throw new NotFoundException('Question not found');
            if (question.authorId === userId) throw new ForbiddenException('Voting on own question');

            const existing = await this.repo.findExistingVoteValue(answerId, userId, tx);
            const oldValue = existing?.value ?? 0;

            if (oldValue === newValue) {
                return {
                    myVote: oldValue,
                    totalVotes: question.voteCount
                };
            }

            const delta = newValue - oldValue;
            if (newValue === 0) {
                if (existing) await this.repo.unVoteQuestion(answerId, userId, tx);
            }
            else await this.repo.voteQuestion(answerId, userId, newValue, tx);

            const updated = await this.repo.updateAnswerVoteCount(answerId, delta, tx);

            return {
                myVote: newValue,
                totalVotes: updated.voteCount
            };
        });
    }
}