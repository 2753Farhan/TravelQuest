import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
export class FindNearbyPlaces {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(
    point: { x: number; y: number },
    radius: number
  ): Promise<Place[]> {
    return this.placeRepository.searchNearby(point, radius);
  }
}