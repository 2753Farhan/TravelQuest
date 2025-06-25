// backend\src\domain\entities\TravelGroup.ts
import { TripStatus } from "../../shared/types";

export class TravelGroup {
  constructor(
    public readonly groupId: string,
    public readonly creatorId: string,
    public readonly title: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly status: TripStatus = TripStatus.PLANNING,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): TravelGroup {
    return new TravelGroup(
      raw.group_id,
      raw.creator_id,
      raw.title,
      raw.start_date ? new Date(raw.start_date) : undefined,
      raw.end_date ? new Date(raw.end_date) : undefined,
      raw.status,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}

export class TripMember {
  constructor(
    public readonly membershipId: string,
    public readonly tripId: string,
    public readonly userId: string,
    public readonly role: string, // 'organizer', 'planner', 'member'
    public readonly invitationStatus: string = 'pending',
    public readonly invitationDetails: Record<string, any> = {},
    public readonly joinedAt?: Date
  ) {}

  static fromRaw(raw: any): TripMember {
    return new TripMember(
      raw.membership_id,
      raw.trip_id,
      raw.user_id,
      raw.role,
      raw.invitation_status,
      raw.invitation_details || {},
      raw.joined_at ? new Date(raw.joined_at) : undefined
    );
  }
}

export class TripItem {
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
    public readonly details: Record<string, any> = {},
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): TripItem {
    return new TripItem(
      raw.added_by,
      raw.item_id,
      raw.group_id,
      raw.place_id,
      raw.transport_id,
      raw.start_time ? new Date(raw.start_time) : undefined,
      raw.end_time ? new Date(raw.end_time) : undefined,
      raw.date ? new Date(raw.date) : undefined,
      raw.status,
      raw.votes || {},
      raw.details || {},
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}