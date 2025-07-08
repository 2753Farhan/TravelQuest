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
      logData.start_date ? new Date(logData.start_date) : undefined,
      logData.end_date ? new Date(logData.end_date) : undefined,
      logData.visibility || 'public',
      logData.status || 'planning'
    );

    return this.travelLogRepository.create(log);
  }
}