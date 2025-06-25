import { UserEntity } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { CreateUserDto } from "../../interface/dto/CreateUserDto";

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: CreateUserDto): Promise<UserEntity> {
    const { name, email } = userData;
    const userEntity = new UserEntity(
      "",
      name,
      email,
      new Date(),
      []
    );
    return await this.userRepository.create(userEntity);
  }
}