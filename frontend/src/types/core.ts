
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
  logId: string         
  title: string        
  description: string  
  creatorId: string    
  createdAt: string    
  updatedAt?: string   
  startDate?: string   
  endDate?: string    
  visibility: VisibilitySettings  
  status: TripStatus   
}


export interface LogEntry {
    entryType: string
    entryId: string,
    logId: string,
    placeId : string | null,
    transportRouteId: string | null,
    title: string,
    cost: number | null,
    timeSpent: string | null,
    effortRating: number | null,
    rating: number | null,
    details: Record<string, any>,
    createdAt: Date
}


export interface TransportOption {
  transport_id: string;
  transport_type: string;
  provider?: string;
  details?: Record<string, any>;
}
export interface Place {
  id: string;
  type: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
  address?: string;
  details?: Record<string, any>;
}

export interface TransportRoute {
  transport_type: string | undefined
  route_id: string;
  transport_id: string;
  start_place_id: string;
  end_place_id?: string;
  cost?: number | undefined;
  duration?: string;
  details?: Record<string, any>;
}


interface BaseUser {
  id: string
  username: string
  email?: string
  avatar?: string
  role?: UserRoles
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



export interface ChatMessage {
  chatId: string
  type: 'group'
  groupId: string
  userId: string | null
  content: string
  createdAt: string
  parentId?: string
  details?: { replies?: ChatMessage[] }
}