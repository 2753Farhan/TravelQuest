import { LogEntry } from "../entities/LogEntry";

export interface LogEntryRepository {
    create(logEntry: Omit<LogEntry, "entryId" | "created_at" | "updated_at">): Promise<LogEntry>;
    findByLogId(logId: string): Promise<LogEntry[]>
    findById(entryId: string): Promise<LogEntry | null>;

    findByIdWithExtendedEntities(entryId: string) : Promise<{
        logEntry: LogEntry,
        place?: any ,
        transportRoute?: any
    }>;

    update(
        entryId: string,
        updates: Partial<Omit<LogEntry, "entryId" | "createdAt" | "logId">> 
    ): Promise<LogEntry>;

    delete(entryId: string): Promise<boolean>;
    validateReference(
        placeId?: string, transportRouteId?: string) : Promise<void>;

}