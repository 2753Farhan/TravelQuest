// src/interface/dto/CreatePlaceDto.ts
import { IsString, IsEnum, IsObject, IsOptional, IsNumber } from 'class-validator';
import { Place } from '../../domain/entities/Place';
import { PlaceTypes } from '../../shared/types';
export class CreatePlaceDto {
  @IsEnum(PlaceTypes)
  type!: PlaceTypes;

  @IsString()
  name!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

export class PlaceResponseDto {
  constructor(
    public readonly place_id: string,
    public readonly type: PlaceTypes,
    public readonly name: string,
    public readonly coordinates: { lat: number; lng: number },
    public readonly address?: string,
    public readonly details: Record<string, any> = {},
    public readonly created_at?: Date,
    public readonly updated_at?: Date
  ) {}

  static fromDomain(place: Place) {
    return new PlaceResponseDto(
      place.place_id,
      place.type as PlaceTypes,
      place.name,
      { lat: place.geo_coordinates.y, lng: place.geo_coordinates.x },
      place.address,
      place.details,
      place.created_at,
      place.updated_at
    );
  }
}