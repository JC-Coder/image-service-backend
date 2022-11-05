import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthService } from '../auth/services/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) { }


  // get user profile 
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: User){
    return user;
  }

}
