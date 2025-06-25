import { UserRepository } from "../../domain/interfaces/UserRepository";
import { UpdateUserDto } from "../../interface/dto/UserDto";
import { UserResponseDto } from "../../interface/dto/UserDto";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const updates = {
      profilePicUrl: dto.profilePicUrl,
      bio: dto.bio
    };

    const updatedUser = await this.userRepository.update(userId, updates);
    return UserResponseDto.fromDomain(updatedUser);
  }
}