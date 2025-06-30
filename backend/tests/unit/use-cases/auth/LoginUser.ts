import { LoginUser } from "../../../../src/use-cases/auth/LoginUser";
import { AuthService } from "../../../../src/domain/services/AuthService";
import { LoginUserDto } from "../../../../src/interface/dto/AuthDto";
import { UserRoles } from "../../../../src/shared/types";

describe("LoginUser", () => {
  let loginUser: LoginUser;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      generateTokens: jest.fn(),
      register: jest.fn(),
      generateVerificationToken: jest.fn(),
      decodeToken: jest.fn(),
      refreshToken: jest.fn(),
      verifyEmail: jest.fn(),
    } as any;

    loginUser = new LoginUser(mockAuthService);
  });

  it("should successfully login a user", async () => {
    const dto: LoginUserDto = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRoles.TRAVELER,
      isVerified: true,
    createdAt: new Date(),
    };

    const mockTokens = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    mockAuthService.login.mockResolvedValue(mockUser);
    mockAuthService.generateTokens.mockReturnValue(mockTokens);

    const result = await loginUser.execute(dto);

    expect(mockAuthService.login).toHaveBeenCalledWith("test@example.com", "password123");
    expect(mockAuthService.generateTokens).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "traveler",
      },
    });
  });

  it("should throw an error for invalid credentials", async () => {
    const dto: LoginUserDto = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    mockAuthService.login.mockRejectedValue(new Error("Invalid credentials"));

    await expect(loginUser.execute(dto)).rejects.toThrow("Invalid credentials");
  });

  it("should throw an error for unverified email", async () => {
    const dto: LoginUserDto = {
      email: "unverified@example.com",
      password: "password123",
    };

    mockAuthService.login.mockRejectedValue(new Error("Please verify your email first"));

    await expect(loginUser.execute(dto)).rejects.toThrow("Please verify your email first");
  });
});