import { TravelGroup, TripMember, TripItem } from "../entities/TravelGroup.ts";

export interface TravelGroupRepository {
  createGroup(group: Omit<TravelGroup, 'groupId' | 'createdAt'>): Promise<TravelGroup>;
  findGroupById(groupId: string): Promise<TravelGroup | null>;
  findGroupsByUser(userId: string): Promise<TravelGroup[]>;
  updateGroup(groupId: string, updates: Partial<TravelGroup>): Promise<TravelGroup>;
  deleteGroup(groupId: string): Promise<boolean>;

  addMember(member: Omit<TripMember, 'membershipId'>): Promise<TripMember>;
  findMemberById(membershipId: string): Promise<TripMember | null>;
  findMembersByGroup(groupId: string): Promise<TripMember[]>;
  findMemberByUserAndGroup(userId: string, groupId: string): Promise<TripMember | null>;
  updateMember(membershipId: string, updates: Partial<TripMember>): Promise<TripMember>;
  removeMember(membershipId: string): Promise<boolean>;
  acceptMemberInvitation(membershipId: string, userId: string): Promise<TripMember>;
  declineMemberInvitation(membershipId: string, userId: string): Promise<TripMember>;

  addItem(item: Omit<TripItem, 'itemId' | 'createdAt'>): Promise<TripItem>;
  findItemById(itemId: string): Promise<TripItem | null>;
  findItemsByGroup(groupId: string): Promise<TripItem[]>;
  updateItem(itemId: string, updates: Partial<TripItem>): Promise<TripItem>;
  removeItem(itemId: string): Promise<boolean>;
  voteOnItem(itemId: string, userId: string, vote: 'up' | 'down'): Promise<TripItem>;
}