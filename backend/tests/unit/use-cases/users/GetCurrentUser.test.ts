import { GetCurrentUser } from "../../../../src/use-cases/users/GetCurrentUser";
import { UserRepository } from "../../../../src/domain/interfaces/UserRepository";
import { UserResponseDto } from "../../../../src/interface/dto/UserDto";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";
import { UserRoles } from "../../../../src/shared/types";

describe("GetCurrentUser", () => {
  let getCurrentUser: GetCurrentUser;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      updateRefreshToken: jest.fn(),
      verifyUser: jest.fn(),
    } as any;

    getCurrentUser = new GetCurrentUser(mockUserRepository);
  });

  it("should return current user details", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRoles.TRAVELER,
      profilePicUrl: "http://example.com/avatar.jpg",
      isVerified: true,
      bio: "Test bio",
      createdAt: new Date(),
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await getCurrentUser.execute("1");

    expect(mockUserRepository.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(UserResponseDto.fromDomain(mockUser));
  });

  it("should throw an error if user not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(getCurrentUser.execute("nonexistent")).rejects.toThrow(BadRequestError);
  });
});