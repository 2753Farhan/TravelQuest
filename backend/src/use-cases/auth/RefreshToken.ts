import { AuthService } from "../../domain/services/AuthService";
import { RefreshTokenDto } from "../../interface/dto/AuthDto";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class RefreshToken {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, newRefreshToken } = await this.authService.refreshToken(dto.refreshToken);

    const payload = this.authService.decodeToken(newRefreshToken);
    await this.authService.userRepository.updateRefreshToken(payload.userId, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }
}