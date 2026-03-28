import { VoteEntityType, VoteValue } from "../dtos/vote-info-dto";

export type VoteResponse = {
  entityId: string;
  entityType: VoteEntityType;
  myVote: VoteValue;
  totalVotes: number;
};