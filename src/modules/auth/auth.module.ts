import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'src/environment/env';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleController } from './controllers/google.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleService } from './services/google.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: '2h'}
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleService],
  exports: [AuthService],
  controllers: [AuthController, GoogleController]
})
export class AuthModule {}
