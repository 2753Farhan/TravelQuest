import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class DeleteTravelLog {
  constructor(private readonly travelLogRepository: TravelLogRepository) {}

  async execute(logId: string): Promise<boolean> {
    const deleted = await this.travelLogRepository.delete(logId);
    if (!deleted) throw new NotFoundError("Travel log not found");
    return true;
  }
}