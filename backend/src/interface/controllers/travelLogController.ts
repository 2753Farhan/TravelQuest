import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateTravelLogDto, TravelLogResponseDto } from "../dto/CreateTravelLogDto";
import { CreateTravelLog } from "../../use-cases/travel_logs/CreateTravelLog";
import { GetTravelLog } from "../../use-cases/travel_logs/GetTravelLog";
import { GetTravelLogsByUser } from "../../use-cases/travel_logs/GetTravelLogsByUser";
import { UpdateTravelLog } from "../../use-cases/travel_logs/UpdateTravelLog";
import { DeleteTravelLog } from "../../use-cases/travel_logs/DeleteTravelLog";

import { BadRequestError } from "../errors/BadRequestError";

export class TravelLogController {
  constructor(
    private readonly createTravelLog: CreateTravelLog,
    private readonly getTravelLog: GetTravelLog,
    private readonly getTravelLogsByUser: GetTravelLogsByUser,
    private readonly updateTravelLog: UpdateTravelLog,
    private readonly deleteTravelLog: DeleteTravelLog,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateTravelLogDto, req.body);

    const errors = await validate(dto);
    if (errors.length > 0) {
      const message = errors
        .map(e => Object.values(e.constraints || {}))
        .join("; ");
      throw new BadRequestError(message);
    }

    const travelLog = await this.createTravelLog.execute(dto);
    res.status(201).json(TravelLogResponseDto.fromDomain(travelLog));
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const travelLog = await this.getTravelLog.execute(id);
    res.json(TravelLogResponseDto.fromDomain(travelLog));
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId ;
    if (!userId) throw new BadRequestError("User ID required");

    const travelLogs = await this.getTravelLogsByUser.execute(userId);
    res.json(travelLogs.map(TravelLogResponseDto.fromDomain));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = plainToInstance(CreateTravelLogDto, req.body);

    const errors = await validate(dto);
    if (errors.length > 0) {
      const message = errors
        .map(e => Object.values(e.constraints || {}))
        .join("; ");
      throw new BadRequestError(message);
    }

    const updates = {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };

    const updatedLog = await this.updateTravelLog.execute(id, updates);
    res.json(TravelLogResponseDto.fromDomain(updatedLog));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.deleteTravelLog.execute(id);
    res.status(204).send();
  }

}