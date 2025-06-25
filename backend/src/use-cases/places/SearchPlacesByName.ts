import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
export class SearchPlacesByName {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(name: string): Promise<Place[]> {
    return this.placeRepository.searchByName(name);
  }
}