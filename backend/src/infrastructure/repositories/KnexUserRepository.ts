import {db} from "../database/knex/knexfile"
import { User,UserEntity } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";


export class KnexUserRepository implements UserRepository{
    async create(user: UserEntity): Promise<UserEntity> {
        const [createdUser] = await db('users')
        .insert({
            name: user.name,
            email: user.email
        })
        .returning('*');

        return new UserEntity(createdUser,createdUser.id);
    }

    async findAll(): Promise<User[]> {
        const users = await db('users').select('*');
        return users.map(user => new UserEntity(user , user.id));
    }
}

