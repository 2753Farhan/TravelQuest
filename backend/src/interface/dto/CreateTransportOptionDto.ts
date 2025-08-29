import { TransportOption } from "../../domain/entities/TransportOption";
import { IsString, IsOptional, IsObject } from "class-validator";

export class CreateTransportOptionDto {
  @IsString()
  transport_type!: string; 
  @IsString()
  @IsOptional()
  provider?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

export class TransportOptionResponseDto {
  constructor(
    public readonly transport_id: string,
    public readonly transport_type: string,
    public readonly provider: string | null,
    public readonly details: Record<string, any>,
    public readonly created_at: Date,
    public readonly updated_at?: Date
  ) {}

  static fromDomain(option: TransportOption): TransportOptionResponseDto {
    return new TransportOptionResponseDto(
      option.transport_id,
      option.transport_type,
      option.provider,
      option.details,
      option.created_at,
      option.updated_at
    );
  }
}