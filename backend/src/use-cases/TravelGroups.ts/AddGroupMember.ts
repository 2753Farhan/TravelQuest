import { TripMember } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AddMemberDto } from "../../interface/dto/TravelGroupDto";

export class AddGroupMember {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(dto: AddMemberDto): Promise<TripMember> {
    return this.repository.addMember({
      tripId: dto.tripId,
      userId: dto.userId,
      role: dto.role,
      invitationStatus: dto.invitationStatus || 'pending',
      invitationDetails: dto.invitationDetails || {}
    });
  }
}