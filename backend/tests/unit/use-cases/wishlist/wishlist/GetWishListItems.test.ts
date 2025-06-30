import { GetWishlistItems } from "../../use-cases/wishlist/GetWishListItems";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { WishlistItem } from "../../domain/entities/Wishlist";

describe("GetWishlistItems", () => {
  let getWishlistItems: GetWishlistItems;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      getItems: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      getItemById: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    } as any;

    getWishlistItems = new GetWishlistItems(mockWishlistRepository);
  });

  it("should return all items for a wishlist", async () => {
    const mockItems = [
      new WishlistItem("item1", "wish1", "place1", "high", "summer", 1000, true, {}, new Date()),
      new WishlistItem("item2", "wish1", "place2", "medium", "winter", 500, true, {}, new Date()),
    ];

    mockWishlistRepository.getItems.mockResolvedValue(mockItems);

    const result = await getWishlistItems.execute("wish1");

    expect(mockWishlistRepository.getItems).toHaveBeenCalledWith("wish1");
    expect(result).toEqual(mockItems);
    expect(result.length).toBe(2);
  });

  it("should return items with place details", async () => {
    const mockItems = [
      new WishlistItem("item1", "wish1", "place1", "high", "summer", 1000, true, {}, new Date()),
    ];

    mockWishlistRepository.getItems.mockResolvedValue(mockItems);

    const result = await getWishlistItems.execute("wish1");

    expect(result[0].placeId).toBe("place1");
  });

  it("should return empty array if wishlist has no items", async () => {
    mockWishlistRepository.getItems.mockResolvedValue([]);

    const result = await getWishlistItems.execute("empty-wishlist");

    expect(result).toEqual([]);
  });
});