export class TransportRoute {
  constructor(
    public readonly route_id: string,
    public readonly transport_id: string,
    public readonly start_place_id: string,
    public readonly end_place_id: string | null,
    public readonly cost: number | null,
    public readonly duration: string | null,
    public readonly details: Record<string, any>,
    public readonly created_at: Date,
    public readonly updated_at?: Date
  ) {}

  static fromRaw(raw: any): TransportRoute {
    return new TransportRoute(
      raw.route_id,
      raw.transport_id,
      raw.start_place_id,
      raw.end_place_id || null,
      raw.cost ? Number(raw.cost) : null,
      raw.duration || null,
      raw.details || {},
      raw.created_at,
      raw.updated_at
    );
  }
}