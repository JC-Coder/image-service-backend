import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
    constructor(@InjectRepository(Image) private imagesRepository: Repository<Image>, @InjectRepository(User) private userRepository: Repository<User>) { }


    // upload new file
    async upload(file: Express.Multer.File, user: User) {
        try {
            let image = new Image();

            image.name = file.filename;
            image.fileType = extname(file.originalname);
            image.mimeType = file.mimetype;
            image.sizeInBytes = file.size;
            image.privatePath = Array(32).fill(null).map(() => Math.round(Math.random() * 10).toString(10)).join('');
            image.userId = user.id;

            // update user total image count 
            let userFromDb = await this.userRepository.findOne({
                where: { id: user.id }
            })


            // check if user reached max limit 
            if (userFromDb.totalFiles >= userFromDb.maximumFiles) {
                throw new BadRequestException('max file limit reached, delete old files to add new one or you upgrade to a premium account');

            } else {

                userFromDb.totalFiles += 1;
                await this.userRepository.save(userFromDb);
            }




            let result = await this.imagesRepository.save(image);

            return {
                result,
                message: "File uploaded successfully"
            }
        } catch (e) {
            throw new BadRequestException(e);

        }

    }

    // get user images 
    async getAll(userId: number){
        return await this.imagesRepository.createQueryBuilder('i').where('i.userId = :userId', {userId: userId}).getMany();
    }


    // get single image by private path 
    async getImagePrivate(path: string){
        let result = await this.imagesRepository.findOne({
            where: {privatePath: path}
        });

        if(!result) throw new NotFoundException('image with path not found ');

        return result.name;
    }


}
