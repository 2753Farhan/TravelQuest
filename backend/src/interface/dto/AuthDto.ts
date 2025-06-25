import { IsString, IsEmail, MinLength, MaxLength, IsEnum, IsOptional } from "class-validator";
import { UserRoles } from "../../shared/types";
export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(['traveler', 'explorer', 'admin', 'moderator'])
  @IsOptional()
  role?: string;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

export class AuthResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly user: {
      id: string;
      username: string;
      email: string;
      role: string;
      profilePicUrl?: string;
    }
  ) {}
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}