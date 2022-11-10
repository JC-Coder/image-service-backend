import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { UserService } from "src/modules/user/user.service";
import { Repository } from "typeorm";
import { confirmPasswordToken } from "../entities/confirm-password.entity";

@Injectable()
export class verifyAccountEmailService {
    constructor(@InjectRepository(confirmPasswordToken) private tokenRepository: Repository<confirmPasswordToken>, @InjectRepository(User) private userRepository: Repository<User>){}


    async verify(payload){
        let user = await this.userRepository.findOne({
            where: {id: payload.id}
        });

        if(!user) throw new BadRequestException('invalid link');

        let token = await this.tokenRepository.findOne({
            where: {
                userId: payload.id,
                token: payload.token
            }
        })

        if(!token)  throw new BadRequestException('invalid link');

        await this.userRepository.update(payload.id, {
            isVerified: true
        });
        await this.tokenRepository.delete(token.id);
        
        return "email verified"

    }
}