import { TripMember } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AcceptInvitationDto } from "../../interface/dto/TravelGroupDto";
export class AcceptInvitation {
  constructor(private readonly travelGroupRepository: TravelGroupRepository) {}

  async execute(dto : AcceptInvitationDto): Promise<TripMember> {
    return this.travelGroupRepository.acceptMemberInvitation(
        dto.membershipId,
        dto.userId,
    )

  }
}