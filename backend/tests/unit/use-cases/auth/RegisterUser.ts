import { RegisterUser } from "../../../../src/use-cases/auth/RegisterUser";
import { KnexUserRepository } from "../../../../src/infrastructure/repositories/KnexUserRepository";
import { AuthService } from "../../../../src/domain/services/AuthService";
import { EmailService } from "../../../../src/domain/services/EmailService";
import { RegisterUserDto } from "../../../../src/interface/dto/AuthDto";
import { UserRoles } from "../../../../src/shared/types";
describe("RegisterUser", () => {
  let registerUser: RegisterUser;
  let mockUserRepository: jest.Mocked<KnexUserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      updateRefreshToken: jest.fn(),
      verifyUser: jest.fn(),
    } as any;

    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      generateTokens: jest.fn(),
      generateVerificationToken: jest.fn(),
      decodeToken: jest.fn(),
      refreshToken: jest.fn(),
      verifyEmail: jest.fn(),
    } as any;

    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    } as any;

    registerUser = new RegisterUser(mockUserRepository, mockAuthService, mockEmailService);
  });

  it("should successfully register a new user", async () => {
    const dto: RegisterUserDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRoles.TRAVELER,
      isVerified: false,
      createdAt: new Date(),
    };

    mockAuthService.register.mockResolvedValue(mockUser);
    mockAuthService.generateVerificationToken.mockReturnValue("verification-token");

    const result = await registerUser.execute(dto);

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      "test@example.com",
      "verification-token"
    );
    expect(result).toEqual({
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "traveler",
      },
      verificationToken: "verification-token",
    });
  });

  it("should throw an error if registration fails", async () => {
    const dto: RegisterUserDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    mockAuthService.register.mockRejectedValue(new Error("Registration failed"));

    await expect(registerUser.execute(dto)).rejects.toThrow("Registration failed");
  });

  it("should register with specified role if provided", async () => {
    const dto: RegisterUserDto = {
      username: "testadmin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    };

    const mockUser = {
      id: "2",
      username: "testadmin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: UserRoles.ADMIN,
      isVerified: false,
      createdAt: new Date(),
    };

    mockAuthService.register.mockResolvedValue(mockUser);
    mockAuthService.generateVerificationToken.mockReturnValue("admin-token");

    const result = await registerUser.execute(dto);

    expect(mockAuthService.register).toHaveBeenCalledWith({
      ...dto,
      role: "admin",
    });
    expect(result.user.role).toBe("admin");
  });
});