import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "src/enums/user-types.enum";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) { }


    async login(user: User) {
        try {
            let token = this.authService.generateToken(user);

            delete user.password;
            return {
                user, token
            }

        } catch (e) {
            throw e;
        }
    }


    async loginWithGoogle(payload) {
        if (!payload.user) throw new BadRequestException();
        console.log(payload.user);

        // if user already exist login user
        let user = await this.userRepository.findOne({
            where: {googleId: payload.user.googleId}
        })
        if (user) {
            return await this.login(user);
        }



        // check if email exists and is connected to google account
        user = await this.userRepository.findOne({ where: { email: payload.user.email  } });

        if (user) {
            throw new ForbiddenException( "User already exists, but Google account was not connected to user's account" );
        } else {
            let newUser = new User();
            console.log(payload);

            newUser.email = payload.user.email,
            newUser.isActive = true,
            newUser.googleId = payload.user.googleId,
            newUser.isRegisteredWithGoogle = true,
            newUser.userType = UserType.USER

            let result =  await this.userRepository.save(newUser);

            if(result) return await this.login(result);
        }


    }
}