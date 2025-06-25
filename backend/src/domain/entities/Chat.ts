// backend\src\domain\entities\Chat.ts
export class Chat {
  constructor(
    public readonly chatId: string,
    public readonly type: string, // 'group', 'direct'
    public readonly parentId?: string, // For threaded replies
    public readonly groupId?: string, // For group chats
    public readonly userId?: string, // For direct messages
    public readonly title?: string,
    public readonly content?: string,
    public readonly details: Record<string, any> = {},
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) {}

  static fromRaw(raw: any): Chat {
    return new Chat(
      raw.chat_id,
      raw.type,
      raw.parent_id,
      raw.group_id,
      raw.user_id,
      raw.title,
      raw.content,
      raw.details || {},
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined
    );
  }
}