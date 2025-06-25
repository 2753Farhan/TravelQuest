import { TravelGroup } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class GetTravelGroup {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(groupId: string): Promise<TravelGroup> {
    const group = await this.repository.findGroupById(groupId);
    if (!group) throw new NotFoundError("Travel group not found");
    return group;
  }
}