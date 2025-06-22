import { TravelLog } from "../../domain/entities/TravelLog";
import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class GetTravelLog {
  constructor(private readonly travelLogRepository: TravelLogRepository) {}

  async execute(logId: string): Promise<TravelLog> {
    const log = await this.travelLogRepository.findById(logId);
    if (!log) throw new NotFoundError("Travel log not found");
    return log;
  }
}