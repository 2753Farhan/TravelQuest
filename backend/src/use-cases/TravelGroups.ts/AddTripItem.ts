import { TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AddTripItemDto } from "../../interface/dto/TravelGroupDto";

export class AddTripItem {
  constructor(private readonly repository: TravelGroupRepository) {}

  async execute(dto: AddTripItemDto): Promise<TripItem> {
    return this.repository.addItem({
      groupId: dto.groupId,
      placeId: dto.placeId,
      transportId: dto.transportId,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      date: dto.date ? new Date(dto.date) : undefined,
      votes: dto.votes || [],
      status: dto.status || 'proposed',
      addedBy: dto.addedBy,
      details: dto.details || {}
    });
  }
}