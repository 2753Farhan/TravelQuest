
import { Chat } from "../entities/Chat";

export interface ChatRepository {
  create(chat: Omit<Chat, 'chatId' | 'createdAt'>): Promise<Chat>;
  findById(chatId: string): Promise<Chat | null>;
  findByGroup(groupId: string): Promise<Chat[]>;
  findByUser(userId: string): Promise<Chat[]>;
  findThreads(parentId: string): Promise<Chat[]>;
  update(chatId: string, updates: Partial<Chat>): Promise<Chat>;
  delete(chatId: string): Promise<boolean>;
}