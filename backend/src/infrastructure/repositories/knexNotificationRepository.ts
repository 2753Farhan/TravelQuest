import { db } from "../database/knex/knexfile";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class KnexNotificationRepository implements NotificationRepository {
  async create(notification: Omit<Notification, 'notificationId' | 'createdAt'>): Promise<Notification> {
    const [created] = await db('notifications')
      .insert({
        user_id: notification.userId,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        related_entity_type: notification.relatedEntityType,
        related_entity_id: notification.relatedEntityId,
        is_read: notification.isRead
      })
      .returning('*');
    return Notification.fromRaw(created);
  }

  async findByUserId(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    let query = db('notifications')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');

    if (unreadOnly) {
      query = query.where('is_read', false);
    }

    const notifications = await query;
    return notifications.map(Notification.fromRaw);
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const [updated] = await db('notifications')
      .where('notification_id', notificationId)
      .update({ is_read: true })
      .returning('*');
    
    if (!updated) throw new NotFoundError("Notification not found");
    return Notification.fromRaw(updated);
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await db('notifications')
      .where('user_id', userId)
      .where('is_read', false)
      .update({ is_read: true });
    
    return result;
  }

  async delete(notificationId: string): Promise<boolean> {
    const deleted = await db('notifications')
      .where('notification_id', notificationId)
      .delete();
    return deleted > 0;
  }
}