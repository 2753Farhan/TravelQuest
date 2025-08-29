import { WishlistItem } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/WishListRepository";
import { AddWishlistItemDto } from "../../interface/dto/WishListDto";

export class AddWishlistItem {
  constructor(private readonly repository: WishlistRepository) {}

  async execute(dto: AddWishlistItemDto): Promise<WishlistItem> {
    return this.repository.addItem({
      wishlistId: dto.wishlistId,
      placeId: dto.placeId ?? null,
      priority: dto.priority,
      targetSeason: dto.targetSeason,
      notificationRadius: dto.notificationRadius ?? 500,
      isActive: dto.isActive ?? true,
      details: dto.details || {}
    });
  }
}