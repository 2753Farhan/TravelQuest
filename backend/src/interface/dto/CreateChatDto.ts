// backend\src\interface\dto\ChatDto.ts
import { IsString, IsUUID, IsOptional, IsEnum, IsObject } from "class-validator";
import { Chat } from "../../domain/entities/Chat";

export class CreateChatDto {
  @IsEnum(['group', 'direct'])
  type!: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsUUID()
  @IsOptional()
  groupId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

export class ChatResponseDto {
  constructor(
    public readonly chatId: string,
    public readonly type: string,
    public readonly parentId?: string,
    public readonly groupId?: string,
    public readonly userId?: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromDomain(chat: Chat): ChatResponseDto {
    return new ChatResponseDto(
      chat.chatId,
      chat.type,
      chat.parentId,
      chat.groupId,
      chat.userId,
      chat.title,
      chat.content,
      chat.createdAt,
      chat.updatedAt
    );
  }
}