import { Notification } from "../entities/Notification.ts";

export interface NotificationRepository {
  create(notification: Omit<Notification, 'notificationId' | 'createdAt'>): Promise<Notification>;
  findByUserId(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<number>;
  delete(notificationId: string): Promise<boolean>;
}