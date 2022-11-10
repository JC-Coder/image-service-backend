import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class confirmPasswordToken {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    userId: number;

    @Column()
    token: string;
}