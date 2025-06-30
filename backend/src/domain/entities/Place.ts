import { PlaceTypes } from "../../shared/types.js";
export class Place {
  constructor(
    public readonly place_id: string,
    public readonly type: PlaceTypes,
    public readonly name: string,
    public readonly geo_coordinates: { x: number; y: number }, // x = longitude, y = latitude
    public readonly address?: string,
    public readonly details: Record<string, any> = {},
    public readonly created_at: Date = new Date(),
    public readonly updated_at?: Date
  ) {}

  static fromRaw(raw: any): Place {
    return new Place(
      raw.place_id,
      raw.type,
      raw.name,
      { 
        x: raw.x || raw.longitude || raw.geo_coordinates?.x || 0,
        y: raw.y || raw.latitude || raw.geo_coordinates?.y || 0
      },
      raw.address,
      raw.details || {},
      raw.created_at,
      raw.updated_at
    );
  }
}