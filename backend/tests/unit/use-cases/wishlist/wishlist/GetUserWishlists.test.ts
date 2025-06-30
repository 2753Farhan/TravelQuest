import { GetUserWishlists } from "../../use-cases/wishlist/GetUserWishlists";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { Wishlist } from "../../domain/entities/Wishlist";

describe("GetUserWishlists", () => {
  let getUserWishlists: GetUserWishlists;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      getItems: jest.fn(),
      getItemById: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    } as any;

    getUserWishlists = new GetUserWishlists(mockWishlistRepository);
  });

  it("should return all wishlists for a user", async () => {
    const mockWishlists = [
      new Wishlist("wish1", "user1", "Dream Destinations", "public", new Date()),
      new Wishlist("wish2", "user1", "Private Places", "private", new Date()),
    ];

    mockWishlistRepository.findByUserId.mockResolvedValue(mockWishlists);

    const result = await getUserWishlists.execute("user1");

    expect(mockWishlistRepository.findByUserId).toHaveBeenCalledWith("user1");
    expect(result).toEqual(mockWishlists);
    expect(result.length).toBe(2);
  });

  it("should return empty array if user has no wishlists", async () => {
    mockWishlistRepository.findByUserId.mockResolvedValue([]);

    const result = await getUserWishlists.execute("user2");

    expect(result).toEqual([]);
  });
});