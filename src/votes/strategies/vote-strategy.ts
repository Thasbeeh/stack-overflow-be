import { VoteValue } from "../dtos/vote-info-dto";

export interface VoteStrategy {
    castVote(entityId: string, currentUserId: string, value: VoteValue);
}