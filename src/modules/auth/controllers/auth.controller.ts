import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';
import { verifyAccountEmailService } from '../services/confirmPassword.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private verifyAccountEmailService: verifyAccountEmailService) { }


    //   register new user
    @Post('register')
    async register(@Body() payload: CreateUserDto): Promise<string> {
        return await this.authService.register(payload);
    }

    // user login 
    @Post('login')
    async login(@Body() payload: LoginDto) {
        return await this.authService.login(payload.email, payload.password);
    }

    // verify account 
    @Get('token/validate/:id/:token')
    async verify(@Param() payload){
        return await this.verifyAccountEmailService.verify(payload);
    }
}
