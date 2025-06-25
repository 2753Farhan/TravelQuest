import { AuthService } from "../../domain/services/AuthService";
import { LoginUserDto } from "../../interface/dto/AuthDto";
import { AuthResponseDto } from "../../interface/dto/AuthDto";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class LoginUser {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.authService.login(dto.email, dto.password);
    const tokens = this.authService.generateTokens(user);

    await this.authService.userRepository.updateRefreshToken(user.id, tokens.refreshToken);

    return new AuthResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicUrl: user.profilePicUrl
      }
    );
  }
}