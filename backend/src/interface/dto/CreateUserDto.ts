import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";
import { UserEntity } from "../../domain/entities/User";
import { PostResponseDto } from "./CreatePostDto";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;
}

export class UserResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly posts: PostResponseDto[] = []
  ) {}

  static fromDomain(user: UserEntity): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.posts.map(post => PostResponseDto.fromDomain(post))
    );
  }
}