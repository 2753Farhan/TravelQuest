import { Router } from "express";
import { TravelGroupController } from "../controllers/travelGroupController";
import { KnexTravelGroupRepository } from "../../infrastructure/repositories/knexTravelGroupRepository";
import { CreateTravelGroup } from "../../use-cases/TravelGroups.ts/CreateTravelGroup";
import { GetTravelGroup } from "../../use-cases/TravelGroups.ts/GetTravelGroup";
import { GetUserTravelGroups } from "../../use-cases/TravelGroups.ts/GetUserTravelGrups";
import { AcceptInvitation } from "../../use-cases/TravelGroups.ts/AcceptInvitation";
import { DeclineInvitation } from "../../use-cases/TravelGroups.ts/DeclineInvitation";
import { AddGroupMember } from "../../use-cases/TravelGroups.ts/AddGroupMember";
import { AddTripItem } from "../../use-cases/TravelGroups.ts/AddTripItem";
import { VoteOnTripItem } from "../../use-cases/TravelGroups.ts/VoteOnTripItem";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const repository = new KnexTravelGroupRepository();

const createTravelGroup = new CreateTravelGroup(repository);
const getTravelGroup = new GetTravelGroup(repository);
const getUserTravelGroups = new GetUserTravelGroups(repository);
const addGroupMember = new AddGroupMember(repository);
const addTripItem = new AddTripItem(repository);
const voteOnTripItem = new VoteOnTripItem(repository);
const acceptInvitation = new AcceptInvitation(repository);
const declineInvitation = new DeclineInvitation(repository);

const controller = new TravelGroupController(
  createTravelGroup,
  getTravelGroup,
  getUserTravelGroups,
  addGroupMember,
  addTripItem,
  voteOnTripItem,
  acceptInvitation,
  declineInvitation
);

router.post("/", asyncHandler(controller.createGroup.bind(controller)));
router.get("/:groupId", asyncHandler(controller.getGroup.bind(controller)));
router.get("/user/:userId", asyncHandler(controller.getUserGroups.bind(controller)));
router.post("/:groupId/members", asyncHandler(controller.addMember.bind(controller)));
router.post("/:groupId/items", asyncHandler(controller.addItem.bind(controller)));
router.post("/items/:itemId/vote", asyncHandler(controller.voteItem.bind(controller)));
router.patch("/members/:membershipId/respond",asyncHandler(controller.acceptMemberInvitation.bind(controller)));

export default router;