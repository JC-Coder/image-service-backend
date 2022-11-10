import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ImagesModule } from '../images/images.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  AuthModule,
  ImagesModule
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
