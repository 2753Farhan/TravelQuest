import { Chat } from "../../domain/entities/Chat";
import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class GetGroupChats {
  constructor(private readonly repository: ChatRepository) {}

  async execute(groupId: string): Promise<Chat[]> {
    return this.repository.findByGroup(groupId);
  }
}