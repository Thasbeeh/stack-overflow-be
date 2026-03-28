import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto{
    @IsString()
    @IsNotEmpty({ message: 'Comment cannot be empty.' })
    content: string
}