import { IsEnum, IsIn, IsInt, IsString } from "class-validator";

export enum VoteEntityType {
    QUESTION = 'QUESTION',
    ANSWER = 'ANSWER'
}

export enum VoteValue {
    UPVOTE = 1,
    UNVOTE = 0,
    DOWNVOTE = -1
}

export class VoteInfoDto{
    @IsString()
    entityId: string

    @IsEnum(VoteEntityType)
    entityType: VoteEntityType

    @IsEnum(VoteValue)
    value: VoteValue
}