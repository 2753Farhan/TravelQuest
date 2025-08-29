import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateLogEntry } from "../../use-cases/LogEntries/CreateLogEntry";
import { GetLogEntries } from "../../use-cases/LogEntries/GetLogEntries";
import { GetLogEntry } from "../../use-cases/LogEntries/GetLogEntry";
import { CreateLogEntryDto, LogEntryResponseDto } from "../dto/CreateLogEntryDto";
import { BadRequestError } from "../errors/BadRequestError";
import { DeleteLogEntry } from "../../use-cases/LogEntries/DeleteLogEntry";

export class LogEntryController {
  constructor(
    private readonly createLogEntry: CreateLogEntry,
    private readonly getLogEntries: GetLogEntries,
    private readonly getLogEntry: GetLogEntry,
    private readonly deleteLogEntry: DeleteLogEntry
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateLogEntryDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; ");
      throw new BadRequestError(message);
    }

    const logEntry = await this.createLogEntry.execute(dto);
    res.status(201).json(LogEntryResponseDto.fromDomain(logEntry));
  }

  async findByLogId(req: Request, res: Response): Promise<void> {
    const { logId } = req.params;
    const { expand } = req.query;

    if (expand === 'all') {
      const logEntries = await this.getLogEntries.execute(logId);
      res.json(logEntries.map(LogEntryResponseDto.fromDomain));
    } else {
      const logEntries = await this.getLogEntries.execute(logId);
      res.json(logEntries.map(LogEntryResponseDto.fromDomain));
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { expand } = req.query;

    if (expand === 'all') {
      const result = await this.getLogEntry.executeWithExpansion(id);
      res.json(LogEntryResponseDto.fromDomain(result));
    } else {
      const logEntry = await this.getLogEntry.execute(id);

      res.json(LogEntryResponseDto.fromDomain(logEntry));
    }
  }


  async delete(req: Request, res: Response): Promise<void> {
    const { entryId } = req.params;
    await this.deleteLogEntry.execute(entryId);
    res.status(204).send();
  }
}