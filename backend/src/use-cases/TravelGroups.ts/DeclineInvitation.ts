import { TripMember } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AcceptInvitationDto } from "../../interface/dto/TravelGroupDto";
export class DeclineInvitation {
  constructor(private readonly travelGroupRepository: TravelGroupRepository) {}

  async execute(dto : AcceptInvitationDto): Promise<TripMember> {
    return this.travelGroupRepository.declineMemberInvitation(
        dto.membershipId,
        dto.userId,
    )

  }
}