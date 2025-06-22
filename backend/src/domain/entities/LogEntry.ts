import { title } from "process"
import { Place } from "./Place"
import { TransportRoute } from "./TransportRoute"

export class LogEntry {
    constructor(
        public readonly entryId: string,
        public readonly logId: string,
        public readonly placeId : string | null,
        public readonly transportRouteId: string | null,
        public readonly title: string,
        public readonly cost: number | null,
        public readonly timeSpent: string | null,
        public readonly effortRating: number | null,
        public readonly rating: number | null,
        public readonly details: Record<string, any>,
        public readonly createdAt: Date

    ) {}
    static fromRaw(raw: any): LogEntry{
        return new LogEntry(
            raw.entry_id,
            raw.log_id,
            raw.place_id,
            raw.transport_id,
            raw.title ,
            raw.cost,
            raw.timeSpent,
            raw.effortRating,
            raw.rating,
            raw.details || {},
            raw.created_at 
        )
    }

}
