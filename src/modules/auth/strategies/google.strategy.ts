import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){

    constructor(@InjectRepository(User) private userRepository: Repository<User>){
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['email', 'profile']
        })
    }


    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
        console.log(profile);
        const {name, emails, photos, id } = profile;
        const user = {
            googleId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);

    }
}