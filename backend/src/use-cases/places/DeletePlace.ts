import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class DeletePlace {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(placeId: string): Promise<void> {
    const deleted = await this.placeRepository.delete(placeId);
    if (!deleted) {
      throw new NotFoundError("Place not found");
    }
  }
}