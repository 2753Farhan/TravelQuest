import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { User } from '../../domain/entities/User';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string ;

  @IsEmail()
  email!: string;
}

export class UserResponseDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date
  ) {}

  static fromDomain(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.name,
      user.email,
      user.createdAt
    );
  }
}