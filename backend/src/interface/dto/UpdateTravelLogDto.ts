import { IsString, IsOptional, IsEnum, IsDateString, MinLength, MaxLength } from "class-validator";

type VisibilitySettings = 'public' | 'private' | 'friends_only';
type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export class UpdateTravelLogDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsEnum(['public', 'private', 'friends_only'])
  @IsOptional()
  visibility?: VisibilitySettings;

  @IsEnum(['planning', 'active', 'completed', 'cancelled'])
  @IsOptional()
  status?: TripStatus;
}