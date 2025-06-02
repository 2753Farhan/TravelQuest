import { User,UserEntity } from "../entities/User";

export interface UserRepository {
    create(user: UserEntity): Promise<User>;
    findAll(): Promise<User[]>;
}