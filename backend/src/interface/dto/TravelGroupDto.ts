// backend\src\interface\dto\TravelGroupDto.ts
import { IsString, IsUUID, IsDateString, IsOptional, IsEnum, IsObject } from "class-validator";
import { TravelGroup, TripMember, TripItem } from "../../domain/entities/TravelGroup";
import { TripStatus } from "../../shared/types";

export class CreateTravelGroupDto {
  @IsUUID()
  creatorId!: string;

  @IsString()
  title!: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(['planning', 'active', 'completed', 'cancelled'])
  @IsOptional()
  status?: TripStatus;
}

export class AddMemberDto {
  @IsUUID()
  tripId!: string;

  @IsUUID()
  userId!: string;

  @IsString()
  role!: string; // 'organizer', 'planner', 'member'

  @IsString()
  @IsOptional()
  invitationStatus?: string;

  @IsObject()
  @IsOptional()
  invitationDetails?: Record<string, any>;
}

export class AddTripItemDto {
  @IsUUID()
  groupId!: string;

  @IsUUID()
  @IsOptional()
  placeId?: string;

  @IsUUID()
  @IsOptional()
  transportId?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsUUID()
  addedBy!: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
    votes: never[] = [];
}

export class AcceptInvitationDto{
    @IsUUID()
    membershipId!: string;

    @IsUUID()
    userId!: string;

    @IsString()
    action: 'accept' | 'decline' = 'accept';
}

export class VoteItemDto {
  @IsUUID()
  userId!: string;

  @IsString()
  vote!: 'up' | 'down';
}

export class TravelGroupResponseDto {
  constructor(
    public readonly groupId: string,
    public readonly creatorId: string,
    public readonly title: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly status: string = 'planning',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date,
    public readonly memberCount?: number,
    public readonly itemCount?: number
  ) {}

  static fromDomain(group: TravelGroup, memberCount?: number, itemCount?: number): TravelGroupResponseDto {
    return new TravelGroupResponseDto(
      group.groupId,
      group.creatorId,
      group.title,
      group.startDate,
      group.endDate,
      group.status,
      group.createdAt,
      group.updatedAt,
      memberCount,
      itemCount
    );
  }
}

export class TripMemberResponseDto {
  constructor(
    public readonly membershipId: string,
    public readonly tripId: string,
    public readonly userId: string,
    public readonly role: string,
    public readonly invitationStatus: string,
    public readonly joinedAt?: Date
  ) {}

  static fromDomain(member: TripMember): TripMemberResponseDto {
    return new TripMemberResponseDto(
      member.membershipId,
      member.tripId,
      member.userId,
      member.role,
      member.invitationStatus,
      member.joinedAt
    );
  }
}

export class TripItemResponseDto {
  constructor(
    public readonly itemId: string,
    public readonly groupId: string,
    public readonly addedBy: string,
    public readonly placeId?: string,
    public readonly transportId?: string,
    public readonly startTime?: Date,
    public readonly endTime?: Date,
    public readonly date?: Date,
    public readonly status: string = 'proposed',
    public readonly votes: Record<string, any> = {},
    public readonly createdAt: Date = new Date()
  ) {}

  static fromDomain(item: TripItem): TripItemResponseDto {
    return new TripItemResponseDto(
      item.itemId,
      item.groupId,
      item.addedBy,
      item.placeId,
      item.transportId,
      item.startTime,
      item.endTime,
      item.date,
      item.status,
      item.votes,
      item.createdAt
    );
  }
}