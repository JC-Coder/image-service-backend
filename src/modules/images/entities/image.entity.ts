import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    mimeType: string;

    @Column()
    sizeInBytes: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    privatePath: string;

    @Column({ nullable: true })
    publicPath: string;

    @Column({ default: 0 })
    views: number;

    @Column()
    fileType: string;

    @ManyToOne(() => User, (user) => user.images)
    user: User;

    @Column()
    userId: number;
}