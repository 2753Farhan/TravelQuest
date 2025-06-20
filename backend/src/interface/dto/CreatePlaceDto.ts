// src/interface/dto/CreatePlaceDto.ts
import { IsEnum, IsString, IsNumber, IsObject, IsOptional } from "class-validator";
import { PlaceTypes } from "../../shared/types";
import { Place } from "../../domain/entities/Place";
export class CreatePlaceDto {
  @IsEnum(PlaceTypes)
  type!: PlaceTypes;

  @IsString()
  name!: string;

  @IsNumber()
  x!: number; // longitude

  @IsNumber()
  y!: number; // latitude

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
    public readonly type: string,
    public readonly name: string,
    public readonly coordinates: { x: number; y: number },
    public readonly address?: string,
    public readonly details: Record<string, any> = {},
    public readonly created_at?: Date,
    public readonly updated_at?: Date
  ) {}

  static fromDomain(place: Place) {
    return new PlaceResponseDto(
      place.place_id,
      place.type,
      place.name,
      { x: place.geo_coordinates.x, y: place.geo_coordinates.y },
      place.address,
      place.details,
      place.created_at,
      place.updated_at
    );
  }
}