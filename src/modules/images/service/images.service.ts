import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { AppUtils } from 'src/helpers/app.helper';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { nanoid } from 'nanoid';
import { Validator } from 'src/validators/image.validator';

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

        AppUtils.deleteImageFile(image.name);
        user.totalFiles -= 1;
        await this.userRepository.save(user);

        return await this.imagesRepository.delete(image.id);
    }

    // find image by private path
    async findByPrivatePath(path: string){
        return await this.imagesRepository.findOne({
            where: {privatePath: path}
        })
    }


    // upload new file
    async upload(file: Express.Multer.File, user: User) {
        try {
            //check file type 
            if(!extname(file.originalname).match(Validator.Regex)){
                AppUtils.deleteImageFile(file.filename);
                throw new BadRequestException('image should be of type png , jpg, jpeg');
            }

            // check file size 
            if(file.size > Validator.MaxSize){
                AppUtils.deleteImageFile(file.filename);
                throw new BadRequestException('image size should not be more than 5mb ');
            }


            let image = new Image();

            image.name = file.filename;
            image.fileType = extname(file.originalname);
            image.mimeType = file.mimetype;
            image.sizeInBytes = file.size;
            image.privatePath = nanoid();
            image.ownerId = user.id;

            // check if user reached max limit 
            if (user.totalFiles >= user.maximumFiles) {
                AppUtils.deleteImageFile(image.name);
                
                throw new BadRequestException('max file limit reached, delete old files to add new one or you upgrade to a premium account');

            } else {

                user.totalFiles += 1;
                await this.userRepository.save(user);
            }


            let result = await this.imagesRepository.save(image);

            return {
                result,
                message: "File uploaded successfully"
            }
        } catch (e) {
            throw e;

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

        // get single image by public path 
        async getPublicImage(path: string) {
            let result = await this.imagesRepository.findOne({
                where: { publicPath: path }
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

        AppUtils.deleteImageFile(image.name);
        user.totalFiles -= 1;
        await this.userRepository.save(user);
        
        return await this.imagesRepository.delete(image.id);
    }


    // generate image public path 
    async generatePublicPath(id: number): Promise<Image>{
        let image = await this.imagesRepository.findOne({
            where: {id: id}
        })

        if(!image){
            throw new NotFoundException('image not found');
        }

        if(image.publicPath) throw new BadRequestException('Public path already exists for this image');

        image.publicPath = nanoid(6) + image.id;
        return await this.imagesRepository.save(image);
    }


}
