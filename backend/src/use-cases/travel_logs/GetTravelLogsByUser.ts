import { TravelLog } from "../../domain/entities/TravelLog";
import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";

export class GetTravelLogsByUser {
  constructor(private readonly travelLogRepository: TravelLogRepository) {}

  async execute(userId: string): Promise<TravelLog[]> {
    return this.travelLogRepository.findByCreator(userId);
  }
}