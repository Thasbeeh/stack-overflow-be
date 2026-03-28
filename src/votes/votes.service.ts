import type { CurrentUser as CurrentUserType } from "src/auth/interfaces/current-user.interface";
import { VoteEntityType, VoteValue } from "./dtos/vote-info-dto";
import { VoteResponse } from "./types/vote-response-type";
import { Injectable } from "@nestjs/common";
import { VoteFactory } from "./vote-factory";

@Injectable()
export class VotesService {
    constructor(private readonly voteFactory: VoteFactory) {}

    async castVote(
        entityId: string,
        entityType: VoteEntityType,
        value: VoteValue,
        currentUser: CurrentUserType
    ): Promise<VoteResponse> {
        const strategy = this.voteFactory.getStrategy(entityType);
        const result = await strategy.castVote(entityId, currentUser.userId,value);

        return {
            entityId,
            entityType,
            ...result
        };
    }
}