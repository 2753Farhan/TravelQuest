// src/interface/dto/CreateTransportRouteDto.ts
import { TransportRoute } from "../../domain/entities/TransportRoute";
import { IsString, IsNumber, IsOptional, IsObject, IsUUID } from "class-validator";

export class CreateTransportRouteDto {
  @IsUUID()
  transport_id!: string; // Reference to TransportOption

  @IsUUID()
  start_place_id!: string; // Origin place ID

  @IsString()
  @IsOptional()
  end_place_id?: string; // Destination place ID

  @IsNumber()
  @IsOptional()
  cost?: number; // In USD

  @IsString()
  @IsOptional()
  duration?: string; // ISO 8601 duration format (e.g., "PT2H30M")

  @IsObject()
  @IsOptional()
  details?: Record<string, any>; // { flight_number: "DL123" }
}

export class TransportRouteResponseDto {
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

  static fromDomain(route: TransportRoute): TransportRouteResponseDto {
    return new TransportRouteResponseDto(
      route.route_id,
      route.transport_id,
      route.start_place_id,
      route.end_place_id,
      route.cost,
      route.duration,
      route.details,
      route.created_at,
      route.updated_at
    );
  }
}