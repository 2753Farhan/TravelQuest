import { IsString, IsNumber, IsOptional, IsUUID, IsObject } from "class-validator";
import { LogEntry } from "../../domain/entities/LogEntry";

export class CreateLogEntryDto {
  @IsUUID()
  logId!: string;

  @IsUUID()
  @IsOptional()
  placeId?: string;

  @IsUUID()
  @IsOptional()
  transportRouteId?: string;

  @IsString()
  title!: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  timeSpent?: string;

  @IsNumber()
  @IsOptional()
  effortRating?: number;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

export class LogEntryResponseDto {
  constructor(
    public readonly entryId: string,
    public readonly logId: string,
    public readonly placeId: string | null,
    public readonly transportRouteId: string | null,
    public readonly title: string,
    public readonly cost: number | null,
    public readonly timeSpent: string | null,
    public readonly effortRating: number | null,
    public readonly rating: number | null,
    public readonly details: Record<string, any>,
    public readonly createdAt: Date,
    public readonly place?: any,
    public readonly transportRoute?: any
  ) {}

  static fromDomain(logEntry: LogEntry): LogEntryResponseDto;
  static fromDomain(result: { logEntry: LogEntry; place?: any; transportRoute?: any }): LogEntryResponseDto;
  static fromDomain(input: LogEntry | { logEntry: LogEntry; place?: any; transportRoute?: any }): LogEntryResponseDto {
    if (input instanceof LogEntry) {
      return new LogEntryResponseDto(
        input.entryId,
        input.logId,
        input.placeId,
        input.transportRouteId,
        input.title,
        input.cost,
        input.timeSpent,
        input.effortRating,
        input.rating,
        input.details,
        input.createdAt
      );
    } else {
      return new LogEntryResponseDto(
        input.logEntry.entryId,
        input.logEntry.logId,
        input.logEntry.placeId,
        input.logEntry.transportRouteId,
        input.logEntry.title,
        input.logEntry.cost,
        input.logEntry.timeSpent,
        input.logEntry.effortRating,
        input.logEntry.rating,
        input.logEntry.details,
        input.logEntry.createdAt,
        input.place,
        input.transportRoute
      );
    }
  }
}