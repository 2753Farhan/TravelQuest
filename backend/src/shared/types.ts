export enum RolePermissions {

}
export enum PlaceTypes {
  LODGING = 'lodging',
  DINING = 'dining',
  ATTRACTION = 'attractions'
}

export enum VisibilitySettings {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only'
}

export enum PriorityLevels {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TripStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}


export enum UserRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  TRAVELER = 'traveler',
  EXPLORER = 'explorer'
}

export type JwtPayload = {
  userId: string;
  email: string;
  role: UserRoles;
  iat?: number;
  exp?: number;
};

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh'
}


export enum NotificationTypes {
  PROXIMITY = 'proximity',
  MATCH = 'match',
  TRIP_UPDATE = 'trip_update',
  MESSAGE = 'message',
  INVITATION = 'invitation'
}

export enum TripMemberRoles {
  ORGANIZER = 'organizer',
  PLANNER = 'planner',
  MEMBER = 'member'
}

export enum ItemStatus {
  PROPOSED = 'proposed',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected'
}

export type GeoCoordinates = {
  lat: number;
  lng: number;
};

export type TimeInterval = {
  hours: number;
  minutes: number;
};

