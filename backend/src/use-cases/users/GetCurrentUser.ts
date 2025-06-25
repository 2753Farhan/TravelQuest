import { UserRepository } from "../../domain/interfaces/UserRepository";
import { UserResponseDto } from "../../interface/dto/UserDto";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class GetCurrentUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return UserResponseDto.fromDomain(user);
  }
}