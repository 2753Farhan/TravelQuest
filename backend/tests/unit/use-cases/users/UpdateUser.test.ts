import { UpdateUser } from "../../../../src/use-cases/users/UpdateUser";
import { UserRepository } from "../../../../src/domain/interfaces/UserRepository";
import { UpdateUserDto } from "../../../../src/interface/dto/UserDto";
import { UserResponseDto } from "../../../../src/interface/dto/UserDto";
import { UserRoles } from "../../../../src/shared/types";

describe("UpdateUser", () => {
  let updateUser: UpdateUser;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      update: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      updateRefreshToken: jest.fn(),
      verifyUser: jest.fn(),
    } as any;

    updateUser = new UpdateUser(mockUserRepository);
  });

  it("should update user profile", async () => {
    const userId = "1";
    const dto: UpdateUserDto = {
      profilePicUrl: "http://example.com/new-avatar.jpg",
      bio: "Updated bio",
    };

    const updatedUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRoles.TRAVELER,
      profilePicUrl: "http://example.com/new-avatar.jpg",
      bio: "Updated bio",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUser.execute(userId, dto);

    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
      profilePicUrl: "http://example.com/new-avatar.jpg",
      bio: "Updated bio",
    });
    expect(result).toEqual(UserResponseDto.fromDomain(updatedUser));
  });

  it("should update only provided fields", async () => {
    const userId = "1";
    const dto: UpdateUserDto = {
      bio: "Only updating bio",
    };

    const updatedUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
      role: UserRoles.TRAVELER,
      profilePicUrl: "http://example.com/avatar.jpg",
      isVerified: true,
      bio: "Only updating bio",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUser.execute(userId, dto);

    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
      bio: "Only updating bio",
    });
    expect(result.bio).toBe("Only updating bio");
    expect(result.profilePicUrl).toBe("http://example.com/avatar.jpg");
  });
});