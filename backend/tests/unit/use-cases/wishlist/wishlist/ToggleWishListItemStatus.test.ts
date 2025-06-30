import { ToggleWishlistItemStatus } from "../../use-cases/wishlist/ToggleWishListItemStatus";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { WishlistItem } from "../../domain/entities/Wishlist";
import { NotFoundError } from "../../interface/errors/NotFoundError";

describe("ToggleWishlistItemStatus", () => {
  let toggleWishlistItemStatus: ToggleWishlistItemStatus;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      getItemById: jest.fn(),
      updateItem: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      getItems: jest.fn(),
      removeItem: jest.fn(),
    } as any;

    toggleWishlistItemStatus = new ToggleWishlistItemStatus(mockWishlistRepository);
  });

  it("should toggle item status from active to inactive", async () => {
    const mockItem = new WishlistItem(
      "item1",
      "wish1",
      "place1",
      "high",
      "summer",
      1000,
      true,
      {},
      new Date()
    );

    const updatedItem = new WishlistItem(
      "item1",
      "wish1",
      "place1",
      "high",
      "summer",
      1000,
      false,
      {},
      new Date(),
      new Date()
    );

    mockWishlistRepository.getItemById.mockResolvedValue(mockItem);
    mockWishlistRepository.updateItem.mockResolvedValue(updatedItem);

    const result = await toggleWishlistItemStatus.execute("item1");

    expect(mockWishlistRepository.getItemById).toHaveBeenCalledWith("item1");
    expect(mockWishlistRepository.updateItem).toHaveBeenCalledWith("item1", {
      isActive: false,
    });
    expect(result.isActive).toBe(false);
  });

  it("should toggle item status from inactive to active", async () => {
    const mockItem = new WishlistItem(
      "item1",
      "wish1",
      "place1",
      "high",
      "summer",
      1000,
      false,
      {},
      new Date()
    );

    const updatedItem = new WishlistItem(
      "item1",
      "wish1",
      "place1",
      "high",
      "summer",
      1000,
      true,
      {},
      new Date(),
      new Date()
    );

    mockWishlistRepository.getItemById.mockResolvedValue(mockItem);
    mockWishlistRepository.updateItem.mockResolvedValue(updatedItem);

    const result = await toggleWishlistItemStatus.execute("item1");

    expect(result.isActive).toBe(true);
  });

  it("should throw error if item doesn't exist", async () => {
    mockWishlistRepository.getItemById.mockResolvedValue(null);

    await expect(toggleWishlistItemStatus.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });
});