import { NotFoundError } from "../../interface/errors/NotFoundError";
import { TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
export class GetTripItemByID {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(itemId: string): Promise<TripItem> {
    const item = await this.repository.findItemById(itemId);
    if (!item) throw new NotFoundError("Item not found");
    return item;
  }
}