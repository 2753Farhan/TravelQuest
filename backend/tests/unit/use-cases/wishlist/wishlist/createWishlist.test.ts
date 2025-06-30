import { CreateWishlist } from "../../use-cases/wishlist/createWishlist";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { CreateWishlistDto } from "../../interface/dto/WishListDto";
import { Wishlist } from "../../domain/entities/Wishlist";

describe("CreateWishlist", () => {
  let createWishlist: CreateWishlist;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      getItems: jest.fn(),
      getItemById: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    } as any;

    createWishlist = new CreateWishlist(mockWishlistRepository);
  });

  it("should create a new wishlist", async () => {
    const dto: CreateWishlistDto = {
      userId: "user1",
      title: "Dream Destinations",
      visibility: "public",
    };

    const mockWishlist = new Wishlist(
      "wish1",
      "user1",
      "Dream Destinations",
      "public",
      new Date()
    );

    mockWishlistRepository.create.mockResolvedValue(mockWishlist);

    const result = await createWishlist.execute(dto);

    expect(mockWishlistRepository.create).toHaveBeenCalledWith({
      userId: "user1",
      title: "Dream Destinations",
      visibility: "public",
    });
    expect(result).toEqual(mockWishlist);
  });

  it("should handle different visibility settings", async () => {
    const privateDto: CreateWishlistDto = {
      userId: "user1",
      title: "Private List",
      visibility: "private",
    };

    const privateWishlist = new Wishlist(
      "wish2",
      "user1",
      "Private List",
      "private",
      new Date()
    );

    mockWishlistRepository.create.mockResolvedValue(privateWishlist);

    const result = await createWishlist.execute(privateDto);

    expect(result.visibility).toBe("private");
  });

  it("should throw error if creation fails", async () => {
    const dto: CreateWishlistDto = {
      userId: "user1",
      title: "Will Fail",
      visibility: "public",
    };

    mockWishlistRepository.create.mockRejectedValue(new Error("Creation failed"));

    await expect(createWishlist.execute(dto)).rejects.toThrow("Creation failed");
  });
});