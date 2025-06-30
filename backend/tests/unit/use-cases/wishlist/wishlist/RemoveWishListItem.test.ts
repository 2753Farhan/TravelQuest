import { RemoveWishlistItem } from "../../use-cases/wishlist/RemoveWishListItem";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

describe("RemoveWishlistItem", () => {
  let removeWishlistItem: RemoveWishlistItem;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      removeItem: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      getItems: jest.fn(),
      getItemById: jest.fn(),
      updateItem: jest.fn(),
    } as any;

    removeWishlistItem = new RemoveWishlistItem(mockWishlistRepository);
  });

  it("should remove a wishlist item", async () => {
    mockWishlistRepository.removeItem.mockResolvedValue(true);

    await removeWishlistItem.execute("item1");

    expect(mockWishlistRepository.removeItem).toHaveBeenCalledWith("item1");
  });

  it("should throw error if item doesn't exist", async () => {
    mockWishlistRepository.removeItem.mockResolvedValue(false);

    await expect(removeWishlistItem.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });
});