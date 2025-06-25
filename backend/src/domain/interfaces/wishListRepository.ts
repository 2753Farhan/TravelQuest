import { Wishlist, WishlistItem } from "../entities/Wishlist";

export interface WishlistRepository {
  create(wishlist: Omit<Wishlist, 'wishlistId' | 'createdAt'>): Promise<Wishlist>;
  findById(wishlistId: string): Promise<Wishlist | null>;
  findByUserId(userId: string): Promise<Wishlist[]>;
  update(wishlistId: string, updates: Partial<Omit<Wishlist, 'wishlistId' | 'userId'>>): Promise<Wishlist>;
  delete(wishlistId: string): Promise<boolean>;

  addItem(item: Omit<WishlistItem, 'itemId' | 'createdAt'>): Promise<WishlistItem>;
  getItems(wishlistId: string): Promise<WishlistItem[]>;
  getItemById(itemId: string): Promise<WishlistItem | null>;
  updateItem(itemId: string, updates: Partial<Omit<WishlistItem, 'itemId' | 'wishlistId'>>): Promise<WishlistItem>;
  removeItem(itemId: string): Promise<boolean>;
   findNearbyItems(
    userId: string,
    point: { x: number; y: number },
    radius: number
  ): Promise<WishlistItem[]>;
  
 findOverlappingWishlists(
    userId: string,
    wishlistId?: string // Optional: restrict to a specific wishlist
  ): Promise<{
    wishlist: Wishlist;
    commonItems: WishlistItem[];
  }[]>;
}