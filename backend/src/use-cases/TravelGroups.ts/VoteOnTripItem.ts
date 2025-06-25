import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { VoteItemDto } from "../../interface/dto/TravelGroupDto";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class VoteOnTripItem {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(itemId: string, dto: VoteItemDto): Promise<any> {
    return this.repository.voteOnItem(itemId, dto.userId, dto.vote);
  }
}