import { IsString, IsOptional, IsUrl, IsUUID } from "class-validator";
import { User } from "../../domain/entities/User";
import { UserRoles } from "../../shared/types";

export class UpdateUserDto {
  @IsUrl()
  @IsOptional()
  profilePicUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  role?: UserRoles
}

export class UserResponseDto {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly role: string,
    public readonly profilePicUrl?: string,
    public readonly bio?: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static fromDomain(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.username,
      user.email,
      user.role,
      user.profilePicUrl,
      user.bio,
      user.createdAt
    );
  }
}