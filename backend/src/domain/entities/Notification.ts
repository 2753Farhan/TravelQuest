export enum NotificationType {
  PROXIMITY = 'proximity',
  MATCH = 'match',
  TRIP_UPDATE = 'trip_update',
  MESSAGE = 'message',
  INVITATION = 'invitation'
}

export class Notification {
  constructor(
    public readonly notificationId: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly content: string,
    public readonly relatedEntityType?: string,
    public readonly relatedEntityId?: string,
    public readonly isRead: boolean = false,
    public readonly createdAt: Date = new Date()
  ) {}

  static fromRaw(raw: any): Notification {
    return new Notification(
      raw.notification_id,
      raw.user_id,
      raw.type,
      raw.title,
      raw.content,
      raw.related_entity_type,
      raw.related_entity_id,
      raw.is_read,
      new Date(raw.created_at))
  }
}