import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Public()
    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body.username, body.email, body.role, body.password)
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
