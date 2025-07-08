import { TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class UpdateTriptItem {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(itemId: string, updateData: Partial<TripItem>): Promise<TripItem> {

    // Save the updated group back to the repository
    const item = await this.repository.updateItem(itemId, updateData);
    if(!item) {
      throw new NotFoundError("Failed to update trip item, item not found");
    }

    return item;
  }
}