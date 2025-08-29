// backend/src/use-cases/wishlist/FindOverlappingWishlists.ts
import { Wishlist, WishlistItem } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { FindOverlappingWishlistsDto } from "../../interface/dto/WishListDto";

export class FindOverlappingWishlists {
  constructor(private readonly repository: WishlistRepository) {}

  async execute(dto: FindOverlappingWishlistsDto): Promise<{
    wishlist: Wishlist;
    commonItems: WishlistItem[];
  }[]> {
    return this.repository.findOverlappingWishlists(dto.userId, dto.wishlistId);
  }
}