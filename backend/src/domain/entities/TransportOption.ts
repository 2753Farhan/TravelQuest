
export class TransportOption {
  constructor(
    public readonly transport_id: string,
    public readonly transport_type: string,
    public readonly provider: string | null,
    public readonly details: Record<string, any>,
    public readonly created_at: Date,
    public readonly updated_at?: Date
  ) {}

  static fromRaw(raw: any): TransportOption {
    return new TransportOption(
      raw.transport_id,
      raw.transport_type,
      raw.provider || null,
      raw.details || {},
      raw.created_at,
      raw.updated_at
    );
  }
}