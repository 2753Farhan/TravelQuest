import { User,UserEntity } from "../entities/User";

export interface UserRepository {
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
}