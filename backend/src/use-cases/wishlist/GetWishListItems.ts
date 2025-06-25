import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
export class GetWishlistItems {
  constructor(private readonly repository: WishlistRepository) {}
  async execute(wishlistId: string) {
    return this.repository.getItems(wishlistId);
  }
}