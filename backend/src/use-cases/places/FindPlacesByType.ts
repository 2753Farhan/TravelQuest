// src/use-cases/places/FindPlacesByType.ts
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
export class FindPlacesByType {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(type: string): Promise<Place[]> {
    return this.placeRepository.findByType(type as Place['type']);
  }
}