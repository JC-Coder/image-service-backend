import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
    constructor(@InjectRepository(Image) private imagesRepository: Repository<Image>, @InjectRepository(User) private userRepository: Repository<User>) { }

    // delete image via id
    async deleteImageById(id: number, user: User){
       
        let image = await this.imagesRepository.findOne({
            where: {id: id}
        })

        if(!image) throw new NotFoundException(`image not found`);

         // check if user is owner 
        if(image.ownerId != user.id) throw new UnauthorizedException();

        fs.unlink(`./uploads/images/${image.name}` ,(err) => {
            if(err) throw err;
        })
        return await this.imagesRepository.delete(image.id);
    }

    // find image by private path
    async findByPrivatePath(path: string){
        return await this.imagesRepository.findOne({
            where: {privatePath: path}
        })
    }

    // generate private path for image 
    async generatePrivatePath(id: number) {
        let rand = Array(18).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('')+id;

        if(await this.findByPrivatePath(rand)){
            throw new BadRequestException('error occured try again later');
        }

        return rand;
    }


    // upload new file
    async upload(file: Express.Multer.File, user: User) {
        try {
            let image = new Image();

            image.name = file.filename;
            image.fileType = extname(file.originalname);
            image.mimeType = file.mimetype;
            image.sizeInBytes = file.size;
            image.privatePath = await this.generatePrivatePath(user.id);
            image.ownerId = user.id;


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

    // get all images 
    async getAllImages() {
        return await this.imagesRepository.find();
    }

    // get user images 
    async getAllUserImages(userId: number) {
        let user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!user) throw new NotFoundException('No user found with id');

        return await this.imagesRepository.createQueryBuilder('i').where('i.ownerId = :ownerId', { ownerId: userId }).getMany();
    }


    // get single image by private path 
    async getImagePrivate(path: string) {
        let result = await this.imagesRepository.findOne({
            where: { privatePath: path }
        });

        if (!result) throw new NotFoundException('image with path not found ');

        return result.name;
    }


    // delete image 
    async deleteImage(path: string, user: User){
       
        let image = await this.findByPrivatePath(path);

        if(!image) throw new NotFoundException(`image with path not found`);

         // check if user is owner 
        if(image.ownerId != user.id) throw new UnauthorizedException();

        fs.unlink(`./uploads/images/${image.name}` ,(err) => {
            if(err) throw err;
        })
        user.totalFiles -= 1;
        await this.userRepository.save(user);
        
        return await this.imagesRepository.delete(image.id);
    }


}
