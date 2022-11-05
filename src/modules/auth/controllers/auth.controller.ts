import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    //   register new user
    @Post('register')
    async register(@Body() payload: CreateUserDto): Promise<object> {
        return await this.authService.register(payload);
    }

    // user login 
    @Post('login')
    async login(@Body() payload: LoginDto) {
        return await this.authService.login(payload.email, payload.password);
    }
}
