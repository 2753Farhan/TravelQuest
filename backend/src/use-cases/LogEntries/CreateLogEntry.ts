import { LogEntry } from "../../domain/entities/LogEntry";
import { LogEntryRepository } from "../../domain/interfaces/logEntryRepository";
import { CreateLogEntryDto } from "../../interface/dto/CreateLogEntryDto";

export class CreateLogEntry {
  constructor(private readonly logEntryRepository: LogEntryRepository) {}

  async execute(dto: CreateLogEntryDto): Promise<LogEntry> {
    return this.logEntryRepository.create({
        logId: dto.logId,
        placeId: dto.placeId ?? null,
        transportRouteId: dto.transportRouteId ?? null,
        title: dto.title,
        cost: dto.cost ?? null,
        timeSpent: dto.timeSpent ?? null,
        effortRating: dto.effortRating ?? null,
        rating: dto.rating ?? null,
        details: dto.details ?? {},
        createdAt: new Date()
    });
  }
}