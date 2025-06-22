import { db } from "../database/knex/knexfile";
import { TravelLog } from "../../domain/entities/TravelLog";
import { TravelLogRepository } from "../../domain/interfaces/travelLogRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class KnexTravelLogRepository implements TravelLogRepository {
  async create(log: Omit<TravelLog, 'logId' | 'createdAt'>): Promise<TravelLog> {
    const [created] = await db('travel_logs')
      .insert({
        title: log.title,
        description: log.description,
        creator_id: log.creatorId,
        start_date: log.startDate,
        end_date: log.endDate,
        visibility: log.visibility,
        status: log.status
      })
      .returning('*');
    
    return TravelLog.fromRaw(created);
  }

  async findById(logId: string): Promise<TravelLog | null> {
    const log = await db('travel_logs').where('log_id', logId).first();
    return log ? TravelLog.fromRaw(log) : null;
  }

  async findByCreator(creatorId: string): Promise<TravelLog[]> {
    const logs = await db('travel_logs').where('creator_id', creatorId);
    return logs.map(TravelLog.fromRaw);
  }

  async update(logId: string, updates: Partial<TravelLog>): Promise<TravelLog> {
    const [updated] = await db('travel_logs')
      .where('log_id', logId)
      .update({
        ...updates,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    if (!updated) throw new NotFoundError("Travel log not found");
    return TravelLog.fromRaw(updated);
  }

  async delete(logId: string): Promise<boolean> {
    const deleted = await db('travel_logs').where('log_id', logId).delete();
    return deleted > 0;
  }
}