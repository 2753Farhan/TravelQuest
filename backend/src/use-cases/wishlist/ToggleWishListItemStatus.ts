import { WishlistRepository } from "../../domain/interfaces/WishListRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";
export class ToggleWishlistItemStatus {
  constructor(private readonly repository: WishlistRepository) {}
  async execute(itemId: string) {
    const item = await this.repository.getItemById(itemId);
    if(!item){
        throw new NotFoundError("Wishlist item not found");
    }
    return this.repository.updateItem(itemId, { 
      isActive: !item.isActive 
    });
  }
}