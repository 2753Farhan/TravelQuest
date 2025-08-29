import { TravelLog } from "../../domain/entities/TravelLog";
import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";
import { CreateTravelLogDto } from "../../interface/dto/CreateTravelLogDto";

export class CreateTravelLog {
  constructor(private readonly travelLogRepository: TravelLogRepository) {}

  async execute(logData: CreateTravelLogDto): Promise<TravelLog> {
    const log = new TravelLog(
      '', 
      logData.title,
      logData.description,
      logData.creatorId,
      logData.startDate ? new Date(logData.startDate) : undefined,
      logData.endDate ? new Date(logData.endDate) : undefined,
      logData.visibility || 'public',
      logData.status || 'planning'
    );

    return this.travelLogRepository.create(log);
  }
}