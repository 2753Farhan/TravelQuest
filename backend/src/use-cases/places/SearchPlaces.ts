
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
export class SearchPlaces {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(query: string): Promise<Place[]> {
    return await this.placeRepository.searchByName(query);
  }
}