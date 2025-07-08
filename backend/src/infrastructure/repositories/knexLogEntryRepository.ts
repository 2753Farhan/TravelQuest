import { NotFoundError } from "../../interface/errors/NotFoundError";
import { db } from "../database/knex/knexfile";
import { LogEntry } from "../../domain/entities/LogEntry";
import { LogEntryRepository } from "../../domain/interfaces/logEntryRepository";
export class knexLogEntryRepository implements LogEntryRepository {

         async validateReference(placeId?: string, transportRouteId?: string) : Promise<void>{
            if(placeId){
                const PlaceExists = await db('places')
                .where('place_id', placeId)
                .first('place_id');

                if(!PlaceExists){
                    throw new NotFoundError(`Place with ID ${placeId} does not exist`);
                }
            }

            if(transportRouteId){
                const transportRouteExists = await db('transport_routes')
                .where('route_id', transportRouteId)
                .first('route_id');

                if(!transportRouteExists){
                    throw new NotFoundError(`Transport Route with ID ${transportRouteId} does not exist`);
                }
            }

        }

        async create(logEntry: Omit<LogEntry, "entryId" | "created_at" | "updated_at">): Promise<LogEntry>{
            await this.validateReference(logEntry.placeId || undefined, logEntry.transportRouteId || undefined)

            const [created] = await db('log_entries')
            .insert({
                log_id: logEntry.logId,
                place_id: logEntry.placeId, 
                transport_id: logEntry.transportRouteId,
                title: logEntry.title,
                cost: logEntry.cost,
                time_spent: logEntry.timeSpent,
                effort_rating: logEntry.effortRating,
                rating: logEntry.rating,
                details: logEntry.details || {}
                
                
            })
            .returning('*');

            return LogEntry.fromRaw(created);
        }

        async findByLogId(logId: string): Promise<LogEntry[]> {
            const entries = await db('log_entries')
                .where('log_id', logId)
                .select('*');
            return entries.map(LogEntry.fromRaw);
        }

        async findById(entryId: string): Promise<LogEntry | null> {
            const entry = await db('log_entries')
                .where('entry_id', entryId)
                .first('*');
            return entry ? LogEntry.fromRaw(entry) : null;
        }

 async findByIdWithExtendedEntities(entryId: string): Promise<{
    logEntry: LogEntry;
    place?: any;
    transportRoute?: any;
}> {
    const result = await db('log_entries')
        .leftJoin('places', 'log_entries.place_id', 'places.place_id')
        .leftJoin('transport_routes', 'log_entries.transport_id', 'transport_routes.route_id')
        .leftJoin('transport_options', 'transport_routes.transport_id', 'transport_options.transport_id')
        .where('log_entries.entry_id', entryId)
        .first()
        .select(
            'log_entries.*',
            'places.place_id as place__place_id',
            'places.type as place__type',
            'places.name as place__name',
            'places.geo_coordinates as place__geo_coordinates',
            
            'transport_routes.route_id as transport__route_id',
            'transport_routes.start_place_id as transport__start_place_id',
            'transport_routes.end_place_id as transport__end_place_id',
            
            'transport_options.transport_id as transport__transport_id',
            'transport_options.transport_type as transport__transport_type'
        );

    if (!result) {
        throw new NotFoundError(`Log entry with ID ${entryId} not found`);
    }

    const logEntryRaw = {
        entry_id: result.entry_id,
        log_id: result.log_id,
        place_id: result.place_id,
        transport_id: result.transport_id,
        title: result.title,
        cost: result.cost,
        time_spent: result.time_spent,
        effort_rating: result.effort_rating,
        rating: result.rating,
        details: result.details,
        created_at: result.created_at,
        updated_at: result.updated_at
    };

    return {
        logEntry: LogEntry.fromRaw(logEntryRaw),
        place: result.place__place_id ? {
            placeId: result.place__place_id,
            type: result.place__type,
            name: result.place__name,
            geoCoordinates: result.place__geo_coordinates
        } : undefined,
        transportRoute: result.transport__route_id ? {
            routeId: result.transport__route_id,
            startPlaceId: result.transport__start_place_id,
            endPlaceId: result.transport__end_place_id,
            transport: {
                transportId: result.transport__transport_id,
                transportType: result.transport__transport_type
            }
        } : undefined
    };
}
        async update(
            entryId: string,
            updates: Partial<Omit<LogEntry, "entryId" | "createdAt" | "logId">>
        ): Promise<LogEntry> {
            await this.validateReference(updates.placeId || undefined, updates.transportRouteId || undefined);

            const [updated] = await db('log_entries')
                .where('entry_id', entryId)
                .update({
                    ...updates,
                    updated_at: new Date()
                })
                .returning('*');

            if (!updated) {
                throw new NotFoundError(`Log entry with ID ${entryId} not found`);
            }

            return LogEntry.fromRaw(updated);
        }

        async delete(entryId: string): Promise<boolean> {
            const result = await db('log_entries')
                .where('entry_id', entryId)
                .delete();

            if (!result) {
                throw new NotFoundError(`Log entry with ID ${entryId} not found`);
            }

            return true;

        }

        
}