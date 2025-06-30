import { RefreshToken } from "../../../../src/use-cases/auth/RefreshToken";
import { AuthService } from "../../../../src/domain/services/AuthService";
import { RefreshTokenDto } from "../../../../src/interface/dto/AuthDto";

describe("RefreshToken", () => {
  let refreshToken: RefreshToken;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      refreshToken: jest.fn(),
      login: jest.fn(),
      generateTokens: jest.fn(),
      register: jest.fn(),
      generateVerificationToken: jest.fn(),
      decodeToken: jest.fn(),
      verifyEmail: jest.fn(),
    } as any;

    refreshToken = new RefreshToken(mockAuthService);
  });

  it("should successfully refresh tokens", async () => {
    const dto: RefreshTokenDto = {
      refreshToken: "old-refresh-token",
    };

    const mockTokens = {
      accessToken: "new-access-token",
      newRefreshToken: "new-refresh-token",
    };

    mockAuthService.refreshToken.mockResolvedValue(mockTokens);

    const result = await refreshToken.execute(dto);

    expect(mockAuthService.refreshToken).toHaveBeenCalledWith("old-refresh-token");
    expect(result).toEqual(mockTokens);
  });

  it("should throw an error for invalid refresh token", async () => {
    const dto: RefreshTokenDto = {
      refreshToken: "invalid-token",
    };

    mockAuthService.refreshToken.mockRejectedValue(new Error("Invalid refresh token"));

    await expect(refreshToken.execute(dto)).rejects.toThrow("Invalid refresh token");
  });
});