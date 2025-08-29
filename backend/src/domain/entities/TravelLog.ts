type VisibilitySettings = 'public' | 'private' | 'friends';
type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export class TravelLog {
  constructor(
    public readonly logId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly creatorId: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly visibility: VisibilitySettings = 'public',
    public readonly status: TripStatus = 'planning',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): TravelLog {
    return new TravelLog(
      raw.log_id,
      raw.title,
      raw.description,
      raw.creator_id,
      raw.start_date ? new Date(raw.start_date) : undefined,
      raw.end_date ? new Date(raw.end_date) : undefined,
      raw.visibility,
      raw.status,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}