import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class GetPlaceById {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(placeId: string): Promise<Place> {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new NotFoundError("Place not found");
    }
    return place;
  }
}