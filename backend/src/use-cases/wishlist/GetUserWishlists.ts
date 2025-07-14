import { Wishlist } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/WishListRepository";

export class GetUserWishlists {
  constructor(private readonly repository: WishlistRepository) {}

  async execute(userId: string): Promise<Wishlist[]> {
    return this.repository.findByUserId(userId);
  }
}