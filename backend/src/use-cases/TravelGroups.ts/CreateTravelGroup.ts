import { TravelGroup } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { CreateTravelGroupDto } from "../../interface/dto/TravelGroupDto";
import { TripStatus } from "../../shared/types";

export class CreateTravelGroup {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(dto: CreateTravelGroupDto): Promise<TravelGroup> {
    return this.repository.createGroup({
      creatorId: dto.creatorId,
      title: dto.title,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      status: dto.status || TripStatus.PLANNING
    });
  }
}