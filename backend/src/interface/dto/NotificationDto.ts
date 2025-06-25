// src/interface/dto/NotificationDto.ts
import { IsString, IsUUID, IsBoolean, IsOptional, IsEnum } from "class-validator";
import { Notification, NotificationType } from "../../domain/entities/Notification";

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsEnum(['proximity', 'match', 'trip_update', 'message', 'invitation'])
  type!: NotificationType;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}

export class NotificationResponseDto {
  constructor(
    public readonly notificationId: string,
    public readonly type: string,
    public readonly title: string,
    public readonly content: string,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
    public readonly relatedEntityType?: string,
    public readonly relatedEntityId?: string
  ) {}

  static fromDomain(notification: Notification): NotificationResponseDto {
    return new NotificationResponseDto(
      notification.notificationId,
      notification.type,
      notification.title,
      notification.content,
      notification.isRead,
      notification.createdAt,
      notification.relatedEntityType,
      notification.relatedEntityId
    );
  }
}

export class MarkAsReadDto {
  @IsUUID()
  notificationId!: string;
}