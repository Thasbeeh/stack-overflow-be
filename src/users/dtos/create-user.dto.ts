import { IsEmail, IsEnum, IsString, IsStrongPassword, Validate } from "class-validator"
import { ConfirmPasswordValidator } from "../validators/confirm-password.validator"
import { Transform } from "class-transformer"
import { UserRole } from "@prisma/client"

export class CreateUserDto {
    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsEnum(UserRole)
    role: UserRole

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string

    @Validate(ConfirmPasswordValidator)
    @Transform(({ value }) => undefined, { toPlainOnly: true })
    confirm_password: string
}