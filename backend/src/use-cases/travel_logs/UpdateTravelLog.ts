import { TravelLog } from "../../domain/entities/TravelLog";
import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class UpdateTravelLog {
  constructor(private readonly travelLogRepository: TravelLogRepository) {}

  async execute(logId: string, updates: Partial<TravelLog>): Promise<TravelLog> {
    const existing = await this.travelLogRepository.findById(logId);
    if (!existing) throw new NotFoundError("Travel log not found");
    
    return this.travelLogRepository.update(logId, updates);
  }
}