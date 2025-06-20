// src/use-cases/places/UpdatePlace.ts
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class UpdatePlace {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(
    placeId: string,
    updates: Partial<Place>
  ): Promise<Place> {
    const updated = await this.placeRepository.update(placeId, updates);
    if (!updated) {
      throw new NotFoundError("Place not found");
    }
    return updated;
  }
}