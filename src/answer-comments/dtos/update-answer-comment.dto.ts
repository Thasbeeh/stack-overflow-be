import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAnswerCommentDto{
    @IsString()
    @IsNotEmpty({ message: 'Comment cannot be empty.' })
    content: string
}