import { LogEntry } from "../../domain/entities/LogEntry";
import { LogEntryRepository } from "../../domain/interfaces/logEntryRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class GetLogEntry {
  constructor(private readonly logEntryRepository: LogEntryRepository) {}

  async execute(entryId: string): Promise<LogEntry> {
    const logEntry = await this.logEntryRepository.findById(entryId);
    if (!logEntry) throw new NotFoundError("Log entry not found");
    return logEntry;
  }

  async executeWithExpansion(entryId: string): Promise<{
    logEntry: LogEntry;
    place?: any;
    transportRoute?: any;
  }> {
    return this.logEntryRepository.findByIdWithExtendedEntities(entryId);
  }
}