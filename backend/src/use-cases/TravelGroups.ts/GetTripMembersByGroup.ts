import { TripMember } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";

export class GetTripMembersByGroup {
  constructor(private readonly travelGroupRepository: TravelGroupRepository) {}

  async execute(groupId: string): Promise<TripMember[]> {
    if (!groupId) {
      throw new Error('Group ID is required');
    }

    const members = await this.travelGroupRepository.findMembersByGroup(groupId);
    return members;
  }
}