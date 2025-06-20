// src/infrastructure/repositories/KnexPlaceRepository.ts
import { db } from "../database/knex/knexfile";
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { BadRequestError } from "../../interface/errors/BadRequestError";

export class KnexPlaceRepository implements PlaceRepository {
  async create(place: Omit<Place, 'place_id' | 'created_at' | 'updated_at'>): Promise<Place> {
    try {
      const [createdPlace] = await db('places')
        .insert({
          type: place.type,
          name: place.name,
          geo_coordinates: db.raw(`ST_Point(${place.geo_coordinates.x}, ${place.geo_coordinates.y})`),
          address: place.address,
          details: place.details
        })
        .returning('*');

      return Place.fromRaw(createdPlace);
    } catch (error) {
      throw new BadRequestError('Failed to create place');
    }
  }

  async findById(place_id: string): Promise<Place | null> {
    try {
      const place = await db('places')
        .where({ place_id })
        .first();
      return place ? Place.fromRaw(place) : null;
    } catch (error) {
      throw new BadRequestError('Failed to find place');
    }
  }

  async findAll(): Promise<Place[]> {
    try {
      const places = await db('places')
        .select('*');
      return places.map(Place.fromRaw);
    } catch (error) {
      throw new BadRequestError('Failed to fetch places');
    }
  }

    async findByType(type: Place['type']): Promise<Place[]> {
        try {
        const places = await db('places')
            .where({ type });
        return places.map(Place.fromRaw);
        } catch (error) {
        throw new BadRequestError('Failed to fetch places by type');
        }
    }
    async searchByName(name: string): Promise<Place[]> {
        try {
            const places = await db('places')
                .where('name', 'ilike', `%${name}%`);
            return places.map(Place.fromRaw);
        } catch (error) {
            throw new BadRequestError('Failed to search places by name');
        }
    }
    async searchNearby(point: { x: number; y: number }, radius: number): Promise<Place[]> {
        try {
            const places = await db('places')
                .whereRaw(`ST_DWithin(geo_coordinates, ST_Point(?, ?), ?)`, [point.x, point.y, radius]);
            return places.map(Place.fromRaw);
        } catch (error) {
            throw new BadRequestError('Failed to search nearby places');
        }
    }
    async update(place_id: string, updates: Partial<Omit<Place, 'place_id' | 'created_at' | 'updated_at'>>): Promise<Place> {
        try {
            const [updatedPlace] = await db('places')
                .where({ place_id })
                .update({
                    ...updates,
                    geo_coordinates: updates.geo_coordinates ? db.raw(`ST_Point(${updates.geo_coordinates.x}, ${updates.geo_coordinates.y})`) : undefined
                })
                .returning('*');
            return Place.fromRaw(updatedPlace);
        } catch (error) {
            throw new BadRequestError('Failed to update place');
        }
    }
    async delete(place_id: string): Promise<void> {
        try {
            const result = await db('places')
                .where({ place_id })
                .del();
            if (result === 0) {
                throw new BadRequestError('Place not found or already deleted');
            }
        } catch (error) {
            throw new BadRequestError('Failed to delete place');
        }
    }
}