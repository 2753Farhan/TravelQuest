import { UserRepository } from "../../domain/interfaces/UserRepository";
import { UserResponseDto } from "../../interface/dto/UserDto";
import { UserRoles } from "../../shared/types";

export class GetAllUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(role?: UserRoles): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll(role);
    return users.map(UserResponseDto.fromDomain);
  }
}