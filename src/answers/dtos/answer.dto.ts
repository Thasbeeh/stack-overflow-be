import { Expose } from "class-transformer"

export class AnswerDto{
    @Expose()
    id: number

    @Expose()
    content: string
    
    @Expose()
    questionId: string

    @Expose()
    authorId: string

    @Expose()
    voteCount: number

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}   