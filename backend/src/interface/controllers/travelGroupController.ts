import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateTravelGroup } from "../../use-cases/TravelGroups.ts/CreateTravelGroup";
import { GetTravelGroup } from "../../use-cases/TravelGroups.ts/GetTravelGroup";
import { GetUserTravelGroups } from "../../use-cases/TravelGroups.ts/GetUserTravelGrups";
import { AddGroupMember } from "../../use-cases/TravelGroups.ts/AddGroupMember";
import { AddTripItem } from "../../use-cases/TravelGroups.ts/AddTripItem";
import { VoteOnTripItem } from "../../use-cases/TravelGroups.ts/VoteOnTripItem";
import { AcceptInvitation } from "../../use-cases/TravelGroups.ts/AcceptInvitation";
import { DeclineInvitation } from "../../use-cases/TravelGroups.ts/DeclineInvitation";
import { GetTripItemByGroupId } from "../../use-cases/TravelGroups.ts/GetTripItemsByGroupId";
import { GetTripItemByID } from "../../use-cases/TravelGroups.ts/GetTripItemByID";
import { UpdateTriptItem } from "../../use-cases/TravelGroups.ts/UpdateTripItem";
import { DeleteTripItem } from "../../use-cases/TravelGroups.ts/DeleteTripItem";
import { GetTripMembersByGroup } from "../../use-cases/TravelGroups.ts/GetTripMembersByGroup";
import { 
  CreateTravelGroupDto, 
  AddMemberDto, 
  AddTripItemDto, 
  VoteItemDto,
  TravelGroupResponseDto,
  TripMemberResponseDto,
  TripItemResponseDto,
  AcceptInvitationDto,
  
} from "../dto/TravelGroupDto";
import { BadRequestError } from "../errors/BadRequestError";
import { asyncHandler } from "../middlewares/asyncHandler";

export class TravelGroupController {
  constructor(
    private readonly createTravelGroup: CreateTravelGroup,
    private readonly getTravelGroup: GetTravelGroup,
    private readonly getUserTravelGroups: GetUserTravelGroups,
    private readonly addGroupMember: AddGroupMember,
    private readonly addTripItem: AddTripItem,
    private readonly voteOnTripItem: VoteOnTripItem,
    private readonly acceptInvitation : AcceptInvitation,
    private readonly declineInvitation : DeclineInvitation,
    private readonly getTripItemByGroupId: GetTripItemByGroupId,
    private readonly getTripItemByID: GetTripItemByID,
    private readonly updateTripItem: UpdateTriptItem,
    private readonly deleteTripItem: DeleteTripItem,
    private readonly getTripMembersByGroup: GetTripMembersByGroup
  ) {}

  createGroup = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateTravelGroupDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const group = await this.createTravelGroup.execute(dto);
    res.status(201).json(TravelGroupResponseDto.fromDomain(group));
  };

  getGroup = async (req: Request, res: Response) => {
    const group = await this.getTravelGroup.execute(req.params.groupId);
    res.json(TravelGroupResponseDto.fromDomain(group));
  };

  getUserGroups = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) throw new BadRequestError("User ID required");

    const groups = await this.getUserTravelGroups.execute(userId);
    res.json(groups.map(g => TravelGroupResponseDto.fromDomain(g)));
  };

  addMember = async (req: Request, res: Response) => {
    const dto = plainToInstance(AddMemberDto, {
      ...req.body,
      tripId: req.params.groupId
    });
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const member = await this.addGroupMember.execute(dto);
    res.status(201).json(TripMemberResponseDto.fromDomain(member));
  };

  acceptMemberInvitation = async(req: Request, res: Response) => {
     const dto = plainToInstance(AcceptInvitationDto, {
      ...req.body,
      membershipId: req.params.membershipId,
      type: req.query.type
    });
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }


    if(dto.action === "accept"){
        const updatedMember = await this.acceptInvitation.execute(dto)
        return res.status(200).json(TripMemberResponseDto.fromDomain(updatedMember));
    }
    else if(dto.action === "decline"){
        const updatedMember = await this.declineInvitation.execute(dto);
        return res.status(200).json(TripMemberResponseDto.fromDomain(updatedMember));

    }
    else {
        throw new BadRequestError("Invalid Action");
    }

  }
 



  addItem = async (req: Request, res: Response) => {
    console.log("req body: ", req.body);
    console.log("req params: ", req.params);
    const dto = plainToInstance(AddTripItemDto, {
      ...req.body,
      groupId: req.params.groupId
    });
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const item = await this.addTripItem.execute(dto);
    res.status(201).json(TripItemResponseDto.fromDomain(item));
  };

  voteItem = async (req: Request, res: Response) => {
    const dto = plainToInstance(VoteItemDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const item = await this.voteOnTripItem.execute(req.params.itemId, dto);
    res.json(TripItemResponseDto.fromDomain(item));
  };


  getTripItemsByGroupId = async (req: Request, res: Response) => {
    const items = await this.getTripItemByGroupId.execute(req.params.groupId);
    res.json(items);
  };
  getTripItemById = async (req: Request, res: Response) => {
    const item = await this.getTripItemByID.execute(req.params.itemId);
    res.json(TripItemResponseDto.fromDomain(item));
  };
  updateTripItemHandler = async (req: Request, res: Response) => {
    const updatedItem = await this.updateTripItem.execute(req.params.itemId, req.body);
    res.json(TripItemResponseDto.fromDomain(updatedItem));
  };

  deleteTripItemHandler = async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    if (!itemId) throw new BadRequestError("Item ID required");

    const deleted = await this.deleteTripItem.execute(itemId);
    if (!deleted) throw new BadRequestError("Item not found or could not be deleted");

    res.status(204).send();
  };
  getTripMembersByGroupHandler = async (req: Request, res: Response) => {
    const members = await this.getTripMembersByGroup.execute(req.params.groupId);
    res.json(members.map(m => TripMemberResponseDto.fromDomain(m)));
  };
}