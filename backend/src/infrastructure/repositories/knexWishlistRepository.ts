import { db } from "../database/knex/knexfile";
import { Wishlist, WishlistItem } from "../../domain/entities/Wishlist";
import { WishlistRepository } from "../../domain/interfaces/wishListRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class KnexWishlistRepository implements WishlistRepository {
  async create(wishlist: Omit<Wishlist, 'wishlistId' | 'createdAt'>): Promise<Wishlist> {
    const [created] = await db('wishlists')
      .insert({
        user_id: wishlist.userId,
        title: wishlist.title,
        visibility: wishlist.visibility
      })
      .returning('*');
    return Wishlist.fromRaw(created);
  }

  async findById(wishlistId: string): Promise<Wishlist | null> {
    const wishlist = await db('wishlists').where('wishlist_id', wishlistId).first();
    return wishlist ? Wishlist.fromRaw(wishlist) : null;
  }

  async findByUserId(userId: string): Promise<Wishlist[]> {
    const wishlists = await db('wishlists').where('user_id', userId);
    return wishlists.map(Wishlist.fromRaw);
  }

  async update(wishlistId: string, updates: Partial<Omit<Wishlist, 'wishlistId' | 'userId'>>): Promise<Wishlist> {
    const [updated] = await db('wishlists')
      .where('wishlist_id', wishlistId)
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundError("Wishlist not found");
    return Wishlist.fromRaw(updated);
  }

  async delete(wishlistId: string): Promise<boolean> {
    const deleted = await db('wishlists').where('wishlist_id', wishlistId).delete();
    return deleted > 0;
  }

  async addItem(item: Omit<WishlistItem, 'itemId' | 'createdAt'>): Promise<WishlistItem> {
    const [created] = await db('wishlist_items')
      .insert({
        wishlist_id: item.wishlistId,
        place_id: item.placeId,
        priority: item.priority,
        target_season: item.targetSeason,
        notification_radius: item.notificationRadius,
        is_active: item.isActive,
        details: item.details
      })
      .returning('*');
    return WishlistItem.fromRaw(created);
  }

  async getItems(wishlistId: string): Promise<WishlistItem[]> {
    const items = await db('wishlist_items')
      .where('wishlist_id', wishlistId)
      .leftJoin('places', 'wishlist_items.place_id', 'places.place_id')
      .select(
        'wishlist_items.*',
        'places.name as place_name',
        'places.type as place_type',
        db.raw('ST_X(places.geo_coordinates::geometry) as place_x'),
        db.raw('ST_Y(places.geo_coordinates::geometry) as place_y')
      );
    return items.map(WishlistItem.fromRaw);
  }

  async getItemById(itemId: string): Promise<WishlistItem | null> {
    const item = await db('wishlist_items').where('item_id', itemId).first();
    return item ? WishlistItem.fromRaw(item) : null;
  }

  async updateItem(itemId: string, updates: Partial<Omit<WishlistItem, 'itemId' | 'wishlistId'>>): Promise<WishlistItem> {
    const [updated] = await db('wishlist_items')
      .where('item_id', itemId)
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');
    if (!updated) throw new NotFoundError("Wishlist item not found");
    return WishlistItem.fromRaw(updated);
  }

  async removeItem(itemId: string): Promise<boolean> {
    const deleted = await db('wishlist_items').where('item_id', itemId).delete();
    return deleted > 0;
  }

async findNearbyItems(
  userId: string,
  point: { x: number; y: number },
  radius: number
): Promise<WishlistItem[]> {
  const items = await db('wishlist_items')
    .join('wishlists', 'wishlist_items.wishlist_id', 'wishlists.wishlist_id')
    .leftJoin('places', 'wishlist_items.place_id', 'places.place_id')
    .where('wishlists.user_id', userId)
    .where('wishlist_items.is_active', true)
    .whereNotNull('wishlist_items.place_id')
    .whereRaw(
      'ST_DWithin(places.geo_coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?)',
      [point.x, point.y, radius]
    )
    .select(
      'wishlist_items.*',
      'places.name as place_name',
      'places.type as place_type',
      db.raw('ST_X(places.geo_coordinates::geometry) as place_x'),
      db.raw('ST_Y(places.geo_coordinates::geometry) as place_y'),
      db.raw('ST_Distance(places.geo_coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)) as distance',
        [point.x, point.y]
      )
    )
    .orderBy('distance');

  return items.map(WishlistItem.fromRaw);
}
async findOverlappingWishlists(
  userId: string,
  wishlistId?: string
): Promise<{ wishlist: Wishlist; commonItems: WishlistItem[] }[]> {
  const userPlacesSubquery = db('wishlist_items')
    .select('place_id')
    .where('place_id', 'is not', null)
    .whereExists(
      db('wishlists')
        .select('*')
        .whereRaw('wishlists.wishlist_id = wishlist_items.wishlist_id')
        .where('wishlists.user_id', userId)
    )
    .where('is_active', true);

  if (wishlistId) {
    userPlacesSubquery.where('wishlist_id', wishlistId);
  }


  const overlapping = await db('wishlist_items as wi')
    .join('wishlists as w', 'wi.wishlist_id', 'w.wishlist_id')
    .join('places as p', 'wi.place_id', 'p.place_id')
    .select(
      'w.*',
      'wi.item_id',
      'wi.wishlist_id as item_wishlist_id',
      'wi.place_id',
      'wi.priority',
      'wi.target_season',
      'wi.notification_radius',
      'wi.is_active',
      'wi.details',
      'wi.created_at as item_created_at',
      'wi.updated_at as item_updated_at',
      'p.name as place_name',
      'p.type as place_type',
      db.raw('ST_X(p.geo_coordinates::geometry) as place_x'),
      db.raw('ST_Y(p.geo_coordinates::geometry) as place_y')
    )
    .where('wi.place_id', 'in', userPlacesSubquery)
    .where('w.user_id', '!=', userId) 
    .where('wi.is_active', true)
    .where(function () {
      this.where('w.visibility', 'public').orWhere('w.visibility', 'friends_only');
    });


  const grouped = overlapping.reduce((acc, row) => {
    const wishlist = Wishlist.fromRaw({
      wishlist_id: row.wishlist_id,
      user_id: row.user_id,
      title: row.title,
      visibility: row.visibility,
      created_at: row.created_at,
      updated_at: row.updated_at
    });

    const item = WishlistItem.fromRaw({
      item_id: row.item_id,
      wishlist_id: row.item_wishlist_id,
      place_id: row.place_id,
      priority: row.priority,
      target_season: row.target_season,
      notification_radius: row.notification_radius,
      is_active: row.is_active,
      details: row.details,
      created_at: row.item_created_at,
      updated_at: row.item_updated_at
    });

    const existing = acc.find((entry: { wishlist: { wishlistId: string; }; }) => entry.wishlist.wishlistId === wishlist.wishlistId);
    if (existing) {
      existing.commonItems.push(item);
    } else {
      acc.push({ wishlist, commonItems: [item] });
    }
    return acc;
  }, [] as { wishlist: Wishlist; commonItems: WishlistItem[] }[]);

  return grouped;
}
}