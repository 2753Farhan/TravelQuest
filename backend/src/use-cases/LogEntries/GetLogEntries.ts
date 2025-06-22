import { LogEntry } from "../../domain/entities/LogEntry";
import { LogEntryRepository } from "../../domain/interfaces/logEntryRepository";
export class GetLogEntries {
  constructor(private readonly logEntryRepository: LogEntryRepository) {}

  async execute(logId: string): Promise<LogEntry[]> {
    return this.logEntryRepository.findByLogId(logId);
  }
}