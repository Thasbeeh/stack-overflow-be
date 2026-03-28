import { Expose } from "class-transformer"
import { UserRole } from "@prisma/client"

export class UserDto {
    @Expose()
    id: number

    @Expose()
    email: string

    @Expose()
    username: string

    @Expose()
    role: UserRole
}