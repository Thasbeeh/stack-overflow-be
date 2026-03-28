import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, MaxLength } from "class-validator"

export class CreateQuestionDto {
    @IsString()
    title: string

    @IsString()
    content: string

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    @MaxLength(10, { each: true })
    @IsString({ each: true })
    tags: string[]
}