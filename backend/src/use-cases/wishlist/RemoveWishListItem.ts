import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
export class RemoveWishlistItem {
  constructor(private readonly repository: WishlistRepository) {}
  async execute(itemId: string) {
    return this.repository.removeItem(itemId);
  }
}