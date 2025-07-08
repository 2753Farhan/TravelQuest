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
      start_date: dto.start_date ? new Date(dto.start_date) : undefined,
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
      status: dto.status || TripStatus.PLANNING
    });
  }
}