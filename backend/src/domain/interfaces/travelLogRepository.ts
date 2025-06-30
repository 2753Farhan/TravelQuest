import { TravelLog } from "../entities/TravelLog.ts";

export interface TravelLogRepository {
  create(log: Omit<TravelLog, 'logId' | 'createdAt'>): Promise<TravelLog>;
  findById(logId: string): Promise<TravelLog | null>;
  findByCreator(creatorId: string): Promise<TravelLog[]>;
  update(logId: string, updates: Partial<TravelLog>): Promise<TravelLog>;
  delete(logId: string): Promise<boolean>;
}