import { GetAllUsers } from "../../../../src/use-cases/users/GetAllUser";
import { UserRepository } from "../../../../src/domain/interfaces/UserRepository";
import { UserResponseDto } from "../../../../src/interface/dto/UserDto";
import { UserRoles } from "../../../../src/shared/types";

describe("GetAllUsers", () => {
  let getAllUsers: GetAllUsers;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateRefreshToken: jest.fn(),
      verifyUser: jest.fn(),
    } as any;

    getAllUsers = new GetAllUsers(mockUserRepository);
  });

  it("should return all users", async () => {
    const mockUsers = [
      {
        id: "1",
        username: "user1",
        email: "user1@example.com",
        password: "hashed1",
        role: UserRoles.TRAVELER,
        createdAt: new Date(),
        isVerified: true,
      },
      {
        id: "2",
        username: "user2",
        email: "user2@example.com",
        password: "hashed2",
        role: UserRoles.EXPLORER,
        isVerified: true,

        createdAt: new Date(),
      },
    ];

    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await getAllUsers.execute();

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([
      UserResponseDto.fromDomain(mockUsers[0]),
      UserResponseDto.fromDomain(mockUsers[1]),
    ]);
  });

  it("should filter users by role", async () => {
    const mockAdminUsers = [
      {
        id: "3",
        username: "admin",
        email: "admin@example.com",
        password: "hashed3",
        role: UserRoles.ADMIN,
        isVerified: true,
        createdAt: new Date(),
      },
    ];

    mockUserRepository.findAll.mockResolvedValue(mockAdminUsers);

    const result = await getAllUsers.execute(UserRoles.ADMIN);

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(UserRoles.ADMIN);
    expect(result).toEqual([
      UserResponseDto.fromDomain(mockAdminUsers[0]),
    ]);
    expect(result[0].role).toBe(UserRoles.ADMIN);
  });

  it("should return empty array if no users found", async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await getAllUsers.execute();

    expect(result).toEqual([]);
  });
});