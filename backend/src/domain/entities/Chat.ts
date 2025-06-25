
export class Chat {
  constructor(
    public readonly chatId: string,
    public readonly type: string, 
    public readonly parentId?: string, 
    public readonly groupId?: string, 
    public readonly userId?: string,
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