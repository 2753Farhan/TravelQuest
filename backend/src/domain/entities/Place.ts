// src/domain/entities/Place.ts
export type PlaceType = 'lodging' | 'dining' | 'attraction' | 'location' | 'activity' | 'other';

export class Place {
  constructor(
    public readonly place_id: string,
    public readonly type: PlaceType,
    public readonly name: string,
    public readonly geo_coordinates: { x: number; y: number }, // PostGIS Point representation
    public readonly address?: string,
    public readonly details: Record<string, any> = {},
    public readonly created_at: Date = new Date(),
    public readonly updated_at?: Date
  ) {}

  static fromRaw(raw: any): Place {
    // Convert PostGIS point to {x,y} if needed
    let coordinates = { x: 0, y: 0 };
    if (typeof raw.geo_coordinates === 'string') {
      const match = raw.geo_coordinates.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (match) {
        coordinates = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
      }
    } else if (raw.geo_coordinates?.x && raw.geo_coordinates?.y) {
      coordinates = raw.geo_coordinates;
    }

    return new Place(
      raw.place_id,
      raw.type,
      raw.name,
      coordinates,
      raw.address,
      raw.details || {},
      raw.created_at,
      raw.updated_at
    );
  }
}