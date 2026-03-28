import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username }
        })
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        })
    }

    createUser(username: string, email: string, role: UserRole, passwordHash: string){
        return this.prisma.user.create({
            data: {
                username,
                email,
                role,
                passwordHash
            }
        });
    }
}