import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { User } from '../../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginI } from 'src/interfaces/login.interface';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/modules/email/email.service';
import { nanoid } from 'nanoid';
import { confirmPasswordToken } from '../entities/confirm-password.entity';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService, private emailService: EmailService, @InjectRepository(confirmPasswordToken) private confirmPasswordToken: Repository<confirmPasswordToken>) { }

    // hash password 
    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    //generate jwt token 
    generateToken(user: User){
        return this.jwtService.sign({
            sub: user.id,
            username: user.username
        })
    }

    // validate credentials for login 
    async validateCredentials(email, password) {
        try {
            let user = await this.userRepository.findOne({
                where: { email: email }
            })

            if (!user) throw new NotFoundException('No user found with this email');

            // compare passwords 
            if (!(await bcrypt.compare(password, user.password))) {
                throw new BadRequestException('Invalid Credentials');
            }

            // check if user is verified
            if(!user.isVerified) throw  new UnauthorizedException('User account not verified');

            delete user.password;
            return user;


        } catch (e) {
            throw e;
        }
    }


    //  register new user 
    async register(payload: CreateUserDto): Promise<string> {
        try {
            let usernameExists = await this.userRepository.findOne({
                where: { username: payload.username }
            });

            let emailExists = await this.userRepository.findOne({
                where: { email: payload.email }
            })

            if (usernameExists) {
                throw new BadRequestException('User with this username already exists');
            } else if (emailExists) {
                throw new BadRequestException('User with this email already exists');
            }

            if (payload.password != payload.confirmPassword) {
                throw new BadRequestException('Password and confirm Password do not match ');
            };

            delete payload.confirmPassword;
            let result = await this.userRepository.save({
                ...payload,
                password: await this.hashPassword(payload.password),
            });


            // generate validation token for confirm password
            let newToken = new confirmPasswordToken();
            const link = nanoid(62);

            newToken.userId = result.id;
            newToken.token = link;

            await this.confirmPasswordToken.save(newToken);
            await this.emailService.sendConfirmPassword({
                to: result.email,
                link: `${process.env.BASE_URL}/auth/token/validate/${newToken.userId}/${newToken.token}`
            })


            return "confirmation link sent to your email";

        } catch (e) {
            throw e;
        }
    }

    // user login 
    async login(email, password): Promise<LoginI> {
        try {
            let user =  await this.validateCredentials(email, password);
            let token = this.generateToken(user);

            return {
                user, token
            }

        } catch (e) {
            throw e;
        }
    }
}
