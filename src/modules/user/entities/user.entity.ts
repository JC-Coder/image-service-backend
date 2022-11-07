import { UserType } from 'src/enums/user-types.enum';
import { Image } from 'src/modules/images/entities/image.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  fullname: string;

  @Column()
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({default: true})
  isActive: boolean;

  @Column({ type: 'enum', enum: UserType , enumName: 'UserType' , default: UserType.USER })
  userType: UserType;

  @Column({ nullable: true})
  avatar: string;

  @Column({default: 100})
  maximumFiles: number;

  @Column({ default: 0})
  totalFiles: number;

  @OneToMany(() => Image, (image) => image.user, {eager: true})
  images: Image[];

}
