import { Chat } from "../../domain/entities/Chat";
import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class GetChatThreads {
  constructor(private readonly repository: ChatRepository) {}

  async execute(parentId: string): Promise<Chat[]> {
    return this.repository.findThreads(parentId);
  }
}