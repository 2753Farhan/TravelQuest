import { db } from "../database/knex/knexfile";
import { TravelGroup, TripMember, TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";
import { ConflictError } from "../../interface/errors/ConflictError";
import { KnexNotificationRepository } from "./knexNotificationRepository";
import { start } from "repl";
import { NotificationType } from "../../domain/entities/Notification";

export class KnexTravelGroupRepository implements TravelGroupRepository {
async createGroup(group: Omit<TravelGroup, 'groupId' | 'createdAt'>): Promise<TravelGroup> {
  let createdGroup: TravelGroup;
  
  
  await db.transaction(async (trx) => {

    const [groupResult] = await trx('travel_groups')
      .insert({
        creator_id: group.creatorId,
        title: group.title,
        start_date: group.start_date,
        end_date: group.end_date,
        status: group.status
      })
      .returning('*');
    
    createdGroup = TravelGroup.fromRaw(groupResult);

    
    await trx('trip_members').insert({
      trip_id: createdGroup.groupId,
      user_id: group.creatorId,
      role: 'organizer', 
      invitation_status: 'accepted', 
      invitation_details: { autoAdded: true }
    });
  });

  return createdGroup!;
}
  async findGroupById(groupId: string): Promise<TravelGroup | null> {
    const group = await db('travel_groups').where('group_id', groupId).first();
    return group ? TravelGroup.fromRaw(group) : null;
  }

  async findGroupsByUser(userId: string): Promise<TravelGroup[]> {
    const groups = await db('travel_groups')
      .leftJoin('trip_members', 'travel_groups.group_id', 'trip_members.trip_id')
      .where('travel_groups.creator_id', userId)
      .orWhere('trip_members.user_id', userId)
      .select('travel_groups.*')
      .distinct();
    return groups.map(TravelGroup.fromRaw);
  }

  async updateGroup(groupId: string, updates: Partial<TravelGroup>): Promise<TravelGroup> {
    const [updated] = await db('travel_groups')
      .where('group_id', groupId)
      .update({
        ...updates,
        updated_at: db.fn.now()
      })
      .returning('*');
    if (!updated) throw new NotFoundError("Travel group not found");
    return TravelGroup.fromRaw(updated);
  }

  async deleteGroup(groupId: string): Promise<boolean> {
    const deleted = await db('travel_groups').where('group_id', groupId).delete();
    return deleted > 0;
  }
async addMember(member: Omit<TripMember, 'membershipId'|'invitationStatus'>): Promise<TripMember> {
  let createdMember: TripMember | undefined = undefined;

  await db.transaction(async (trx) => {
    
    const existingMember = await trx('trip_members')
      .where({
        trip_id: member.tripId,
        user_id: member.userId
      })
      .first();

    if (existingMember) {
      throw new ConflictError("User is already a member of this trip");
    }

    const [memberResult] = await trx('trip_members')
      .insert({
        trip_id: member.tripId,
        user_id: member.userId,
        role: member.role,
        invitation_status: "pending",
        invitation_details: member.invitationDetails
      })
      .returning('*');
    
    createdMember = TripMember.fromRaw(memberResult);

    const group = await trx('travel_groups')
      .where('group_id', member.tripId)
      .first();
    
    if (!group) {
      throw new NotFoundError("Travel group not found");
    }

    await trx('notifications').insert({
      user_id: member.userId,
      type: 'invitation',
      title: `Trip Invitation: ${group.title}`,
      content: `You've been invited to join the trip "${group.title}".`,
      related_entity_type: 'trip_members',
      related_entity_id: createdMember.membershipId,
      is_read: false,
      created_at: db.fn.now()
    });
  });

  if (!createdMember) {
    throw new Error("Failed to create trip member");
  }
  return createdMember;
}
 async acceptMemberInvitation(membershipId: string, userId: string): Promise<TripMember> {
    
    const member = await db('trip_members')
      .where('membership_id', membershipId)
      .andWhere('user_id', userId)
      .first();

    if (!member) {
      throw new NotFoundError("Trip member not found");
    }

    if (member.invitation_status !== 'pending') {
      throw new Error("Invitation is not pending");
    }

    const [updatedMember] = await db('trip_members')
      .where('membership_id', membershipId)
      .update({
        invitation_status: 'accepted',
        joined_at: db.fn.now()
      })
      .returning('*');

    return TripMember.fromRaw(updatedMember);
 }

 declineMemberInvitation(membershipId: string, userId: string): Promise<TripMember> {
    return db.transaction(async (trx) => {
        const member = await trx('trip_members')
        .where('membership_id', membershipId)
        .andWhere('user_id', userId)
        .first();
    
        if (!member) {
        throw new NotFoundError("Trip member not found");
        }
    
        if (member.invitation_status !== 'pending') {
        throw new Error("Invitation is not pending");
        }
    
        const [updatedMember] = await trx('trip_members')
        .where('membership_id', membershipId)
        .update({
            invitation_status: 'declined',
            updated_at: db.fn.now()
        })
        .returning('*');
    
        return TripMember.fromRaw(updatedMember);
    });
 }

  async findMemberById(membershipId: string): Promise<TripMember | null> {
    const member = await db('trip_members').where('membership_id', membershipId).first();
    return member ? TripMember.fromRaw(member) : null;
  }

  async findMembersByGroup(groupId: string): Promise<TripMember[]> {
    const members = await db('trip_members')
      .where('trip_id', groupId)
      .andWhere('invitation_status', 'accepted')  
      .select('*');
  
    return members.map(TripMember.fromRaw);
  }

  async findMemberByUserAndGroup(userId: string, groupId: string): Promise<TripMember | null> {
    const member = await db('trip_members')
      .where('user_id', userId)
      .andWhere('trip_id', groupId)
      .first();
    return member ? TripMember.fromRaw(member) : null;
  }

  async updateMember(membershipId: string, updates: Partial<TripMember>): Promise<TripMember> {
    const [updated] = await db('trip_members')
      .where('membership_id', membershipId)
      .update({
        ...updates,
        updated_at: db.fn.now()
      })
      .returning('*');
    if (!updated) throw new NotFoundError("Trip member not found");
    return TripMember.fromRaw(updated);
  }

  async removeMember(membershipId: string): Promise<boolean> {
    const deleted = await db('trip_members').where('membership_id', membershipId).delete();
    return deleted > 0;
  }



  
  async addItem(item: Omit<TripItem, 'itemId' | 'createdAt'>): Promise<TripItem> {
    const [created] = await db('trip_items')
      .insert({
        group_id: item.groupId,
        place_id: item.placeId,
        transport_id: item.transportId,
        start_time: item.startTime,
        end_time: item.endTime,
        date: item.date,
        status: item.status,
        votes: item.votes,
        added_by: item.addedBy,
        details: item.details
      })
      .returning('*');
    return TripItem.fromRaw(created);
  }

  async findItemById(itemId: string): Promise<TripItem | null> {
    const item = await db('trip_items').where('item_id', itemId).first();
    return item ? TripItem.fromRaw(item) : null;
  }

 async findExtendedItemById(itemId: string): Promise<{
    tripitem: TripItem;
    place?: any;
    transportRoute?: any;
}> {
const result = await db('trip_items')
    .leftJoin('places', 'trip_items.place_id', 'places.place_id')
    .leftJoin('transport_routes', 'trip_items.transport_id', 'transport_routes.route_id')
    .leftJoin('transport_options', 'transport_routes.transport_id', 'transport_options.transport_id')
    
    .leftJoin('places as start_place', 'transport_routes.start_place_id', 'start_place.place_id')
    
    .leftJoin('places as end_place', 'transport_routes.end_place_id', 'end_place.place_id')
    .where('trip_items.item_id', itemId)
    .first()
    .select(
        'trip_items.*',
        'places.place_id as place__place_id',
        'places.type as place__type',
        'places.name as place__name',
        'places.geo_coordinates as place__geo_coordinates',
        
        'transport_routes.route_id as transport__route_id',
        'transport_routes.start_place_id as transport__start_place_id',
        'transport_routes.end_place_id as transport__end_place_id',
        
        'transport_options.transport_id as transport__transport_id',
        'transport_options.transport_type as transport__transport_type',
        
        
        'start_place.place_id as transport__start_place__place_id',
        'start_place.type as transport__start_place__type',
        'start_place.name as transport__start_place__name',
        'start_place.geo_coordinates as transport__start_place__geo_coordinates',
        
        
        'end_place.place_id as transport__end_place__place_id',
        'end_place.type as transport__end_place__type',
        'end_place.name as transport__end_place__name',
        'end_place.geo_coordinates as transport__end_place__geo_coordinates'
    );
    if (!result) {
        throw new NotFoundError(`Trip Item with ID ${itemId} not found`);
    }

const tripItemRaw = {
    item_id: result.item_id,
    group_id: result.group_id,
    place_id: result.place_id,
    transport_id: result.transport_id,
    start_time: result.start_time,
    end_time: result.end_time,
    date: result.date,
    status: result.status,
    votes: result.votes,
    added_by: result.added_by,
    details: result.details
};

return {
    tripitem: TripItem.fromRaw(tripItemRaw),
    place: result.place__place_id ? {
      place_id: result.place__place_id,
      type: result.place__type,
      name: result.place__name,
      geo_coordinates: result.place__geo_coordinates
    } : undefined,
    transportRoute: result.transport__route_id ? {
      
      route_id: result.transport__route_id,
      start_place_id: result.transport__start_place_id,
      
      end_place_id: result.transport__end_place_id,
      transport_id: result.transport__transport_id,
      transport_type: result.transport__transport_type,
      start_place: result.transport__start_place__place_id ? {
        place_id: result.transport__start_place__place_id,
        type: result.transport__start_place__type,
        name: result.transport__start_place__name,
        geo_coordinates: result.transport__start_place__geo_coordinates
      } : undefined,
      end_place: result.transport__end_place__place_id ? {
        place_id: result.transport__end_place__place_id,
        type: result.transport__end_place__type,
        name: result.transport__end_place__name,
        geo_coordinates: result.transport__end_place__geo_coordinates
      } : undefined,
    } : undefined
};
}
  async findItemsByGroup(groupId: string): Promise<TripItem[]> {
    const items = await db('trip_items')
      .where('group_id', groupId)
      .select('*');
    return items;
  }

  async updateItem(itemId: string, updates: Partial<TripItem>): Promise<TripItem> {
    const [updated] = await db('trip_items')
      .where('item_id', itemId)
      .update({
        ...updates,
        updated_at: db.fn.now()
      })
      .returning('*');
    if (!updated) throw new NotFoundError("Trip item not found");
    return TripItem.fromRaw(updated);
  }

  async removeItem(itemId: string): Promise<boolean> {
    const deleted = await db('trip_items').where('item_id', itemId).delete();
    return deleted > 0;
  }

  async voteOnItem(itemId: string, userId: string, vote: 'up' | 'down'): Promise<TripItem> {
    const item = await this.findItemById(itemId);
    if (!item) throw new NotFoundError("Trip item not found");

    const votes = { ...item.votes };
    votes[userId] = vote;

    return this.updateItem(itemId, { votes });
  }


  
async CurrentLocationProximityItem(
  groupId: string,
  point: { x: number; y: number },
  radius: number,
  notificationRepository: KnexNotificationRepository = new KnexNotificationRepository() 
): Promise<any> {
  try {
    if (!groupId || !point || typeof point.x !== 'number' || typeof point.y !== 'number') {
      throw new Error('Invalid input parameters');
    }

    
    const items = await db('trip_items')
      .join('travel_groups', 'trip_items.group_id', 'travel_groups.group_id')
      .leftJoin('places', 'trip_items.place_id', 'places.place_id')
      .where('trip_items.group_id', groupId)
      .whereNotNull('trip_items.place_id')
      .whereRaw(
        'ST_DWithin(places.geo_coordinates, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?)',
        [point.x, point.y, radius]
      )
      .select(
        'trip_items.*',
        'places.name as place_name',
        'places.type as place_type',
        db.raw('ST_X(places.geo_coordinates::geometry) as place_x'),
        db.raw('ST_Y(places.geo_coordinates::geometry) as place_y'),
        db.raw(`
          ST_Distance(
            places.geo_coordinates::geography, 
            ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography
          ) as distance`,
          [point.x, point.y]
        )
      )
      .orderBy('distance', 'asc');

    if (items.length > 0) {
      
      const groupMembers = await db('trip_members')
        .where('trip_id', groupId)
        .select('user_id');

      
      const placeNames = items.map(item => item.place_name).join(', ');
      const notificationContent = `You're near these locations: ${placeNames}`;

      
      const notificationPromises = groupMembers.map(member => 
        notificationRepository.create({
          userId: member.user_id,
          type: NotificationType.PROXIMITY,
          title: 'Nearby trip locations',
          content: notificationContent,
          relatedEntityType: 'group',
          relatedEntityId: groupId,
          isRead: false
        }).catch((error: any) => {
          console.error(`Failed to send notification to user ${member.user_id}:`, error);
          return null; 
        })
      );

      await Promise.all(notificationPromises);
    }

    return items.length > 0 ? items : null;
  } catch (error) {
    console.error('Error in CurrentLocationProximityItem:', error);
    throw new Error('Failed to find nearby trip items');
  }
}
}