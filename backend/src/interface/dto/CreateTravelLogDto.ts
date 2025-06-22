import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, MinLength, MaxLength } from "class-validator";
type VisibilitySettings = 'public' | 'private' | 'friends';
type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled';
import { TravelLog } from "../../domain/entities/TravelLog";


export class CreateTravelLogDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @IsString()
  description!: string;

  @IsUUID()
  creatorId!: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(['public', 'private', 'friends_only'])
  @IsOptional()
  visibility?: VisibilitySettings;

  @IsEnum(['planning', 'active', 'completed', 'cancelled'])
  @IsOptional()
  status?: TripStatus;
}

export class TravelLogResponseDto {
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

  static fromDomain(log: TravelLog): TravelLogResponseDto {
    return new TravelLogResponseDto(
      log.logId,
      log.title,
      log.description,
      log.creatorId,
      log.startDate,
      log.endDate,
      log.visibility,
      log.status,
      log.createdAt,
      log.updatedAt
    );
  }
}