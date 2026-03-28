import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateQuestionDto {
    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    content: string

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    @MaxLength(10, { each: true })
    @IsString({ each: true })
    tags: string[]
}