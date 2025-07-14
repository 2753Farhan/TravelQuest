// src/use-cases/wishlist/FindNearbyWishlistItems.ts
import { WishlistItem } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/WishListRepository";

export class FindNearbyWishlistItems {
  constructor(private readonly repository: WishlistRepository) {}

  async execute(
    userId: string,
    point: { x: number; y: number },
    radius: number
  ): Promise<WishlistItem[]> {
    return this.repository.findNearbyItems(userId, point, radius);
  }
}