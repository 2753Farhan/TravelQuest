export enum VisibilitySettings {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends_only'
}
export enum PriorityLevels {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
export class Wishlist {
  constructor(
    public readonly wishlistId: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly visibility: VisibilitySettings,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): Wishlist {
    return new Wishlist(
      raw.wishlist_id,
      raw.user_id,
      raw.title,
      raw.visibility,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}

export class WishlistItem {
  constructor(
    public readonly itemId: string,
    public readonly wishlistId: string,
    public readonly placeId: string | null,
    public readonly priority: PriorityLevels,
    public readonly targetSeason?: string,
    public readonly notificationRadius: number = 500,
    public readonly isActive: boolean = true,
    public readonly details: Record<string, any> = {},
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): WishlistItem {
    return new WishlistItem(
      raw.item_id,
      raw.wishlist_id,
      raw.place_id,
      raw.priority,
      raw.target_season,
      raw.notification_radius,
      raw.is_active,
      raw.details,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}