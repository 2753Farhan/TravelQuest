import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { CreateChat } from "../../use-cases/TravelDiscussion/CreateChat";
import { GetGroupChats } from "../../use-cases/TravelDiscussion/GetGroupChats";
import { GetChatThreads } from "../../use-cases/TravelDiscussion/GetCheatThreads";
import { CreateChatDto,ChatResponseDto  } from "../dto/CreateChatDto";
import { BadRequestError } from "../errors/BadRequestError";
import { asyncHandler } from "../middlewares/asyncHandler";

export class ChatController {
  constructor(
    private readonly createChat: CreateChat,
    private readonly getGroupChats: GetGroupChats,
    private readonly getChatThreads: GetChatThreads
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = plainToInstance(CreateChatDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }
    console.log(dto);

    const chat = await this.createChat.execute(dto);
    res.status(201).json(ChatResponseDto.fromDomain(chat));
  };

  getGroupMessages = async (req: Request, res: Response) : Promise<void> => {
    const groupId = req.params.groupId;
    if (!groupId) throw new BadRequestError("Group ID required");

    const chats = await this.getGroupChats.execute(groupId);
    res.json(chats.map(ChatResponseDto.fromDomain));
  };

  getThreads = async (req: Request, res: Response) : Promise<void>=> {
    const parentId = req.params.parentId;
    if (!parentId) throw new BadRequestError("Parent message ID required");

    const threads = await this.getChatThreads.execute(parentId);
    res.json(threads.map(ChatResponseDto.fromDomain));
  };
}