import { User } from "src/modules/user/entities/user.entity";

export interface LoginI {
    user: User;
    token: string;
}