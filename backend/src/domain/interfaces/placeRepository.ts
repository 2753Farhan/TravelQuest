
import { Place } from "../entities/Place";

export interface PlaceRepository {
  create(place: Omit<Place, 'place_id' | 'created_at' | 'updated_at'>): Promise<Place>;
  findById(place_id: string): Promise<Place | null>;
  findAll(options?: { page?: number, limit?: number }): Promise<Place[] | { data: Place[], meta: any }>;
  searchByName(name: string): Promise<Place[]>;
  searchNearby(point: { x: number; y: number }, radius: number): Promise<Place[]>;
  update(place_id: string, updates: Partial<Place>): Promise<Place>;
  delete(place_id: string): Promise<Boolean>;
  findByType(type: Place['type']): Promise<Place[]>;
}