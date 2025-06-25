// backend\src\infrastructure\repositories\knexChatRepository.ts
import { db } from "../database/knex/knexfile";
import { Chat } from "../../domain/entities/Chat";
import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class KnexChatRepository implements ChatRepository {
  async create(chat: Omit<Chat, 'chatId' | 'createdAt'>): Promise<Chat> {
    const [created] = await db('chats')
      .insert({
        type: chat.type,
        parent_id: chat.parentId,
        group_id: chat.groupId,
        user_id: chat.userId,
        title: chat.title,
        content: chat.content,
        details: chat.details
      })
      .returning('*');
    return Chat.fromRaw(created);
  }

  async findById(chatId: string): Promise<Chat | null> {
    const chat = await db('chats').where('chat_id', chatId).first();
    return chat ? Chat.fromRaw(chat) : null;
  }

  async findByGroup(groupId: string): Promise<Chat[]> {
    const chats = await db('chats')
      .where('group_id', groupId)
      .andWhere('type', 'group')
      .select('*');
    return chats.map(Chat.fromRaw);
  }

  async findByUser(userId: string): Promise<Chat[]> {
    const chats = await db('chats')
      .where('user_id', userId)
      .andWhere('type', 'direct')
      .select('*');
    return chats.map(Chat.fromRaw);
  }

  async findThreads(parentId: string): Promise<Chat[]> {
    const chats = await db('chats')
      .where('parent_id', parentId)
      .select('*');
    return chats.map(Chat.fromRaw);
  }

  async update(chatId: string, updates: Partial<Chat>): Promise<Chat> {
    const [updated] = await db('chats')
      .where('chat_id', chatId)
      .update({
        ...updates,
        updated_at: db.fn.now()
      })
      .returning('*');
    if (!updated) throw new NotFoundError("Chat not found");
    return Chat.fromRaw(updated);
  }

  async delete(chatId: string): Promise<boolean> {
    const deleted = await db('chats').where('chat_id', chatId).delete();
    return deleted > 0;
  }
}