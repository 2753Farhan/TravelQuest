import { WishlistRepository } from "../../domain/interfaces/WishListRepository";
export class GetWishlistItems {
  constructor(private readonly repository: WishlistRepository) {}
  async execute(wishlistId: string) {
    return this.repository.getItems(wishlistId);
  }
}