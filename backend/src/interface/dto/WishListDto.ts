import { IsString, IsUUID, IsEnum, IsOptional, IsNumber, IsBoolean, MaxLength, MinLength } from "class-validator";
import { Wishlist, WishlistItem } from "../../domain/entities/Wishlist";
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

export class CreateWishlistDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @IsEnum(VisibilitySettings)
  visibility!: VisibilitySettings;
}

export class AddWishlistItemDto {
  @IsUUID()
  wishlistId!: string;

  @IsUUID()
  @IsOptional()
  placeId?: string;

  @IsEnum(PriorityLevels)
  priority!: PriorityLevels;

  @IsString()
  @IsOptional()
  targetSeason?: string;

  @IsNumber()
  @IsOptional()
  notificationRadius?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  details?: Record<string, any>;
}

export class WishlistResponseDto {
  constructor(
    public readonly wishlistId: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly visibility: VisibilitySettings,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly itemCount?: number,
    public readonly username?: string
  ) {}

  static fromDomain(wishlist: Wishlist, itemCount?: number): WishlistResponseDto {
    return new WishlistResponseDto(
      wishlist.wishlistId,
      wishlist.userId,
      wishlist.title,
      wishlist.visibility,
      wishlist.createdAt,
      wishlist.updatedAt,
      itemCount
    );
  }
}

export class FindNearbyWishlistItemsDto {

    

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsNumber()
  @IsOptional()
  radius?: number;
}


export class FindOverlappingWishlistsDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  @IsOptional()
  wishlistId?: string;
}


export class OverlappingWishlistResponseDto {
  constructor(
    public readonly item: {
      id: string;
      priority: string;
      placeId?: string;

    },
    public readonly wishlist: {
      id: string;
      title: string;
    },
    public readonly user: {
      id: string;
      username: string;
    }
  ) {}

  static fromRaw(data: {
    item: WishlistItem;
    wishlist: Wishlist;
    user: { userId: string; username: string };
  }) {
    return new OverlappingWishlistResponseDto(
      {
        id: data.item.itemId,
        priority: data.item.priority,
        placeId: data.item.placeId || undefined,
      },
      {
        id: data.wishlist.wishlistId,
        title: data.wishlist.title
      },
      {
        id: data.user.userId,
        username: data.user.username
      }
    );
  }
}