import { Expose } from "class-transformer"

export class QuestionDto{
    @Expose()
    id: number

    @Expose()
    title: string

    @Expose()
    content: string

    @Expose()
    authorId: string

    @Expose()
    voteCount: number

    @Expose()
    acceptedAnswerId: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    tags: string[]
}   