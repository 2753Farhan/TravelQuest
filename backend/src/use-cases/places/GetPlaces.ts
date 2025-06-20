import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
export class GetPlaces {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(): Promise<Place[]> {
    return await this.placeRepository.findAll();
  }
}