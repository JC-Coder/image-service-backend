import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/service/images.service';
import { User } from './entities/user.entity';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, private imagesService: ImagesService
  ) { }

  // find user by id
  async findById(id): Promise<User>{
    return await this.userRepository.findOne({
      where: {id: id}
    })
  }

  // get user with images 
  async findUserWithImages(id: number){
    let result = await this.imagesService.getAllUserImages(id);

    result.forEach((item) => {
      console.log(item.name);
    })

    return await result;
  }


  // get all users
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // update user profile 
  async updateProfile(id: number, payload: any) {
    try {
      if (Object.keys(payload).length <= 0) throw new BadRequestException('update input cannot be empty');

      let result = await this.userRepository.update(id, payload);

      if(result.affected > 0) {
        let user = await this.findById(id);

        return {
          user: user,
          message: 'update successful'
        }
      }
    } catch (err) {
      throw err;
    }
  }

  // delete user 
  async deleteUser(id: number){
    let user = await this.findById(id);

    if(!user) throw new NotFoundException('user with id not found');

    // delete user images 
    let userImages = await this.imagesService.getAllUserImages(id);

    userImages.forEach(async (item) => {
      await this.imagesService.deleteImageById(item.id, user);
    })

    await this.userRepository.delete(id);

    return {message: "user deleted successfully"};
  }


}
