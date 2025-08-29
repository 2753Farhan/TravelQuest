
import { db } from "../database/knex/knexfile";
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { BadRequestError } from "../../interface/errors/BadRequestError";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class KnexPlaceRepository implements PlaceRepository {
  private selectColumns = [
    'place_id',
    'type',
    'name',
    db.raw('ST_X(geo_coordinates::geometry) as x'),
    db.raw('ST_Y(geo_coordinates::geometry) as y'),
    'address',
    'details',
    'created_at',
    'updated_at'
  ];

  async create(place: Omit<Place, 'place_id' | 'created_at' | 'updated_at'>): Promise<Place> {
    try {
      const [result] = await db('places')
        .insert({
          type: place.type,
          name: place.name,
          geo_coordinates: db.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)', [
            place.geo_coordinates.x,
            place.geo_coordinates.y
          ]),
          address: place.address,
          details: place.details
        })
        .returning(this.selectColumns);

      return Place.fromRaw(result);
    } catch (error :any) {
      throw new BadRequestError(`Failed to create place: ${error.message}`);
    }
  }

  async findById(place_id: string): Promise<Place | null> {
    const place = await db('places')
      .select(this.selectColumns)
      .where('place_id', place_id)
      .first();

    return place ? Place.fromRaw(place) : null;
  }


async findAll(options?: { page?: number, limit?: number }): Promise<Place[] | { data: Place[], meta: any }> {
  if (!options?.page && !options?.limit) {
    
    const places = await db('places').select(this.selectColumns);
    return places.map(Place.fromRaw);
  }

  
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const offset = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    db('places')
      .select(this.selectColumns)
      .offset(offset)
      .limit(limit),
      
    db('places')
      .count('* as total')
      .first()
  ]);

  const totalCount = parseInt(total?.total as string, 10) || 0;
  
  return {
    data: data.map(Place.fromRaw),
    meta: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

  async findByType(type: Place['type']): Promise<Place[]> {
    const places = await db('places')
      .select(this.selectColumns)
      .where('type', type);
    return places.map(Place.fromRaw);
  }

  async searchByName(name: string): Promise<Place[]> {
    const places = await db('places')
      .select(this.selectColumns)
      .where('name', 'ilike', `%${name}%`);
    return places.map(Place.fromRaw);
  }

  async searchNearby(point: { x: number; y: number }, radius: number): Promise<Place[]> {
    return db('places')
      .select([
        ...this.selectColumns,
        db.raw('ST_Distance(geo_coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326)) as distance', 
          [point.x, point.y]
        )
      ])
      .whereRaw(
        'ST_DWithin(geo_coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?)',
        [point.x, point.y, radius]
      )
      .orderBy('distance')
      .then(rows => rows.map(Place.fromRaw));
  }

  async update(place_id: string, updates: Partial<Place>): Promise<Place> {
    const updateData: any = { ...updates, updated_at: db.fn.now() };

    if (updates.geo_coordinates) {
      updateData.geo_coordinates = db.raw(
        'ST_SetSRID(ST_MakePoint(?, ?), 4326)',
        [updates.geo_coordinates.x, updates.geo_coordinates.y]
      );
    }

    const [updated] = await db('places')
      .where('place_id', place_id)
      .update(updateData)
      .returning(this.selectColumns);

    if (!updated) throw new NotFoundError('Place not found');
    return Place.fromRaw(updated);
  }

  async delete(place_id: string):  Promise<Boolean> {
    const deleted = await db('places').where('place_id', place_id).delete();
    if (!deleted) throw new NotFoundError('Place not found');
    return true;
  }


}