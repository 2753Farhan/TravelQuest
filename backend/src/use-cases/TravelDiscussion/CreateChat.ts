import { Chat } from "../../domain/entities/Chat";
import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { CreateChatDto } from "../../interface/dto/CreateChatDto";

export class CreateChat {
  constructor(private readonly repository: ChatRepository) {}

  async execute(dto: CreateChatDto): Promise<Chat> {
    console.log("Creating chat with DTO:", dto);
    return this.repository.create({
      type: dto.type,
      parentId: dto.parentId,
      groupId: dto.groupId,
      userId: dto.userId,
      title: dto.title,
      content: dto.content,
      details: dto.details || {}
    });
  }
}
