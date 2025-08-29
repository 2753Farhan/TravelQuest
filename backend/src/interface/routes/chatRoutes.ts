import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { KnexChatRepository } from "../../infrastructure/repositories/knexChatRepository";
import { CreateChat } from "../../use-cases/TravelDiscussion/CreateChat";
import { GetGroupChats } from "../../use-cases/TravelDiscussion/GetGroupChats";
import { GetChatThreads } from "../../use-cases/TravelDiscussion/GetCheatThreads";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const repository = new KnexChatRepository();

const createChat = new CreateChat(repository);
const getGroupChats = new GetGroupChats(repository);
const getChatThreads = new GetChatThreads(repository);

const controller = new ChatController(
  createChat,
  getGroupChats,
  getChatThreads
);

router.post("/", asyncHandler(controller.create.bind(controller)));
router.get("/group/:groupId", asyncHandler(controller.getGroupMessages.bind(controller)));
router.get("/thread/:parentId", asyncHandler(controller.getThreads.bind(controller)));

export default router;