import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class UsersService {
    constructor(
        private repo: UsersRepository,
        private emailsService: EmailsService,
    ) {}

    findUnique(username: string) {
        return this.repo.findByUsername(username);
    }

    async createUser(username: string, email: string, role: UserRole, password: string){
        // check username/email exist else create user
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const { passwordHash, ...user } = await this.repo.createUser(username, email, role, hashedPassword);
            console.log(user.id)
            await this.emailsService.sendWelcomeEmail(user.id);

            return user;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                const fields = (e.meta?.driverAdapterError as any)?.cause?.constraint?.fields
                const messages: Record<string, string> = {
                    'username': 'Username already exists',
                    'email': 'Email already exists',
                }
                throw new ConflictException(messages[fields]);
            }
            throw e;
        }

    }
}
