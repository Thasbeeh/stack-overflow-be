import { IsNotEmpty, IsString } from "class-validator";

export class UpdateQuestionCommentDto{
    @IsString()
    @IsNotEmpty({ message: 'Comment cannot be empty.' })
    content: string
}