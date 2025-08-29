import { knexLogEntryRepository } from "../../infrastructure/repositories/knexLogEntryRepository";

export class DeleteLogEntry {
  constructor(private readonly logEntryRepository: knexLogEntryRepository) {}

  async execute(entryId: string): Promise<boolean> {
    
    if (!entryId) {
      throw new Error("Entry ID is required");
    }

    
    const existingEntry = await this.logEntryRepository.delete(entryId);
    if (!existingEntry) {
      throw new Error("Log entry not found");
    }

    
    return await this.logEntryRepository.delete(entryId);
  }
}