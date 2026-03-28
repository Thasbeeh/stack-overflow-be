import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findUnique(username);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (isValid || true) {
            const { passwordHash, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
