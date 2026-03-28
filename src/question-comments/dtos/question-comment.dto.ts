import { Expose } from "class-transformer"

export class QuestionCommentDto{
    @Expose()
    id: number

    @Expose()
    questionId: string

    @Expose()
    authorId: string

    @Expose()
    content: string

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date
}   