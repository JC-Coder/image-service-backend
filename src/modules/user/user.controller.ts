import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserIsUserGuard } from '../auth/guards/userIsUser.guard';
import { AuthService } from '../auth/services/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) { }


  // get user profile 
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: User){
    return user;
  }

  // get all users 
  @Get()
  async findAll(): Promise<User[]>{
    return await this.userService.findAll()
  }

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number){
    return await this.userService.findUserWithImages(id);
  }


  // update user profile 
  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto){
      return await this.userService.updateProfile(id, payload);
  }

  // delete user 
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number){
    return await this.userService.deleteUser(id);
  }

}