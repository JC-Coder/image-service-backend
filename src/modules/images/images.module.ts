import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ImagesController } from './controller/images.controller';
import { Image } from './entities/image.entity';
import { ImagesService } from './service/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, User]),
    MulterModule.register({
      dest: './uploads'
    })
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
  exports: [ImagesService]
})
export class ImagesModule {}
