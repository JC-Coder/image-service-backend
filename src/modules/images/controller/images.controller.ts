import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../service/images.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as path from 'path';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';

@Controller('images')
export class ImagesController {
    constructor(private imagesService: ImagesService){}

    // upload image 
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/images',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }))
    async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: User){
        return await this.imagesService.upload(file, user);
    }

    // get user images 
    @Get('/all/:userId')
    async getAll(@Param('userId', ParseIntPipe) userId: number){
        return await this.imagesService.getAll(userId);
    }

    // get image by private path
    @Get('user/:privatePath')
    @UseGuards(JwtAuthGuard)
    async getImage(@Res() res: Response, @Param('privatePath') privatePath: any){
      try{
        let image = await this.imagesService.getImagePrivate(privatePath);

        res.sendFile(path.join(process.cwd(), `./uploads/images/${image}`));
      }catch(e){
        throw e;
        
      }
      
    }

 

}
