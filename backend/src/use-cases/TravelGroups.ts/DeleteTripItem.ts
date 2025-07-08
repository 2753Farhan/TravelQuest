import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class DeleteTripItem {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(itemId: string): Promise<boolean> {
     return  await this.repository.removeItem(itemId);
  }
}