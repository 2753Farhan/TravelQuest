import { AddWishlistItem } from "../../use-cases/wishlist/AddWishlistItem";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { AddWishlistItemDto } from "../../interface/dto/WishListDto";
import { WishlistItem } from "../../domain/entities/Wishlist";

describe("AddWishlistItem", () => {
  let addWishlistItem: AddWishlistItem;
  let mockWishlistRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockWishlistRepository = {
      addItem: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getItems: jest.fn(),
      getItemById: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    } as any;

    addWishlistItem = new AddWishlistItem(mockWishlistRepository);
  });

  it("should add a new wishlist item with place reference", async () => {
    const dto: AddWishlistItemDto = {
      wishlistId: "wish1",
      placeId: "place1",
      priority: "high",
      targetSeason: "summer",
      notificationRadius: 1000,
      isActive: true,
      details: { notes: "Must visit" },
    };

    const mockItem = new WishlistItem(
      "item1",
      "wish1",
      "place1",
      "high",
      "summer",
      1000,
      true,
      { notes: "Must visit" },
      new Date()
    );

    mockWishlistRepository.addItem.mockResolvedValue(mockItem);

    const result = await addWishlistItem.execute(dto);

    expect(mockWishlistRepository.addItem).toHaveBeenCalledWith({
      wishlistId: "wish1",
      placeId: "place1",
      priority: "high",
      targetSeason: "summer",
      notificationRadius: 1000,
      isActive: true,
      details: { notes: "Must visit" },
    });
    expect(result).toEqual(mockItem);
  });

  it("should handle optional fields with defaults", async () => {
    const dto: AddWishlistItemDto = {
      wishlistId: "wish1",
      priority: "medium",
    };

    const mockItem = new WishlistItem(
      "item2",
      "wish1",
      null,
      "medium",
      undefined,
      500,
      true,
      {},
      new Date()
    );

    mockWishlistRepository.addItem.mockResolvedValue(mockItem);

    const result = await addWishlistItem.execute(dto);

    expect(result.notificationRadius).toBe(500);
    expect(result.isActive).toBe(true);
    expect(result.details).toEqual({});
  });

  it("should allow items without place reference", async () => {
    const dto: AddWishlistItemDto = {
      wishlistId: "wish1",
      priority: "low",
      details: { description: "Somewhere nice" },
    };

    const mockItem = new WishlistItem(
      "item3",
      "wish1",
      null,
      "low",
      undefined,
      500,
      true,
      { description: "Somewhere nice" },
      new Date()
    );

    mockWishlistRepository.addItem.mockResolvedValue(mockItem);

    const result = await addWishlistItem.execute(dto);

    expect(result.placeId).toBeNull();
    expect(result.details.description).toBe("Somewhere nice");
  });
});