import { TravelGroup } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";

export class GetUserTravelGroups {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(userId: string): Promise<TravelGroup[]> {
    return this.repository.findGroupsByUser(userId);
  }
}