import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from "src/environment/env";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(User) private userRepository: Repository<User>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Env.JWT_SECRET
        });
    }

    async validate(payload: any){
        let user = await this.userRepository.findOne({
            where: {username: payload.username},
            relations: ['images']
        }) 
        delete user.password;

        return user;
    }
}