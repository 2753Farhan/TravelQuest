import { db } from "../database/knex/knexfile";
import { TravelGroup, TripMember, TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

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

    // Then, add the creator as a member
    await trx('trip_members').insert({
      trip_id: createdGroup.groupId,
      user_id: group.creatorId,
      role: 'organizer', // or 'admin' depending on your role system
      invitation_status: 'accepted', // since they created it
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

    // Optional: Create notification for trip admin about new pending member
    // if (member.invitationDetails?.invitedBy) {
    //   await trx('notifications').insert({
    //     user_id: member.invitationDetails.invitedBy,
    //     type: 'trip_invitation_sent',
    //     title: `Invitation Sent`,
    //     content: `Your invitation to join ${group.title} has been sent.`,
    //     related_entity_type: 'trip_members',
    //     related_entity_id: createdMember.membershipId,
    //     is_read: false,
    //     created_at: db.fn.now()
    //   });
    // }
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
      .andWhere('invitation_status', 'accepted')  // Only include accepted members
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



  // Item operations
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
}