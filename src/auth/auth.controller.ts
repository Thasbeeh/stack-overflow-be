import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('/logout')
    async logout(@Request() req) {
    }
}