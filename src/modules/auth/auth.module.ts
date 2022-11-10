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
import { EmailModule } from '../email/email.module';
import { confirmPasswordToken } from './entities/confirm-password.entity';
import { verifyAccountEmailService } from './services/confirmPassword.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, confirmPasswordToken]),
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: '2h'}
    }),
    EmailModule
   ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleService, verifyAccountEmailService],
  exports: [AuthService],
  controllers: [AuthController, GoogleController]
})
export class AuthModule {}
