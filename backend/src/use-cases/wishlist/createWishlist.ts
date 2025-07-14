import { Wishlist } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/WishListRepository";
import { CreateWishlistDto } from "../../interface/dto/WishListDto";
export class CreateWishlist {
  constructor(private readonly repository: WishlistRepository) {}

  async execute(dto: CreateWishlistDto): Promise<Wishlist> {
    return this.repository.create({
      userId: dto.userId,
      title: dto.title,
      visibility: dto.visibility
    });
  }
}