
export type UserRoles = 'admin' | 'moderator' | 'traveler' | 'explorer'

export enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  Traveler = 'traveler',
  Explorer = 'explorer'
}

export type VisibilitySettings = 'public' | 'private' | 'friends_only'


export type PriorityLevels = 'low' | 'medium' | 'high'


export type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled'


export type NotificationType = 'proximity' | 'match' | 'trip_update' | 'message' | 'invitation'


export type PlaceTypes = 'lodging' | 'dining' | 'attraction' | 'location' | 'activity' | 'other'


export type TripMemberRoles = 'organizer' | 'planner' | 'member'


export type ItemStatus = 'proposed' | 'confirmed' | 'rejected'


export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'revoked'




export interface TravelLog {
  title: string;
  placeId?: string;
  transportId?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  status?: string;
  addedBy: string;
  details?: Record<string, any>;  
}


export interface LogEntry {
  logId: string
  placeId?: string
  transportRouteId?: string
  title: string
  cost?: number
  timeSpent?: string
  effortRating?: number
  rating?: number
  details?: Record<string, any>
}


export interface TransportOption {
  transport_type: string
  provider?: string
  details?: Record<string, any>
}
export interface Place {
  type: string
  name: string
  x: number
  y: number
  address?: string
  details?: Record<string, any>
}

export interface TransportRoute {
  transport_id: string
  start_place_id: string
  end_place_id?: string
  cost?: number
  duration?: string
  details?: Record<string, any>
}


interface BaseUser {
  id: string
  username: string
  email?: string
  avatar?: string
  role?: UserRoles
}


export interface TravelGroup {
    creatorId: string
  title: string
  startDate?: string
  endDate?: string
  status?: string
}


export interface GroupMember {
  membershipId: string
  user: BaseUser
  role: TripMemberRoles
  invitationStatus: InvitationStatus
  joinedAt?: string
  invitedBy?: string
  lastActiveAt?: string
}


export interface AddMemberData {
  userId: string
  role: string
  invitationDetails?: Record<string, any>
}


export interface RespondToInvitationData {
  userId: string
  action: 'accept' | 'decline'
}


export interface TripItem {
  title: string
  placeId?: string
  transportId?: string
  startTime?: string
  endTime?: string
  date?: string
  status?: string
  addedBy: string
  details?: Record<string, any>;
}


export interface VoteOnTripItemData {
  userId: string
  vote: 'up' | 'down'
}


export interface ChatMessage {
  type: string
  parent_id?: string
  group_id?: string
  user_id?: string
  title?: string
  content?: string
  details?: Record<string, any>
}

export interface Notification {
  userId: string
  type: string
  title: string
  content: string
  relatedEntityType?: string
  relatedEntityId?: string
}
export interface wishlists {
  userId: string
  title: string
  visibility: VisibilitySettings
}

export interface WishlistItem {
  placeId?: string;
  priority: PriorityLevels;
  targetSeason?: string;
  notificationRadius?: number;
  isActive?: boolean;
  details?: Record<string, any>;
}