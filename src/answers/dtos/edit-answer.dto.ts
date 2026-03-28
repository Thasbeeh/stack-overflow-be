import { IsString } from "class-validator"

export class EditAnswerDto {
    @IsString()
    content: string
}