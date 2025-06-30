
import { Place } from "../entities/Place.ts";

export interface PlaceRepository {
  create(place: Omit<Place, 'place_id' | 'created_at' | 'updated_at'>): Promise<Place>;
  findById(place_id: string): Promise<Place | null>;
  findAll(): Promise<Place[]>;
  findByType(type: Place['type']): Promise<Place[]>;
  searchByName(name: string): Promise<Place[]>;
  searchNearby(point: { x: number; y: number }, radius: number): Promise<Place[]>;
  update(place_id: string, updates: Partial<Place>): Promise<Place>;
  delete(place_id: string): Promise<Boolean>;
}