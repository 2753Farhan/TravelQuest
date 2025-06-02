import { UserEntity } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { CreateUserDto } from "../../interface/dto/CreateUserDto";

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: CreateUserDto): Promise<UserEntity> {
    const userEntity = new UserEntity(userData);
    return await this.userRepository.create(userEntity);
  }
}