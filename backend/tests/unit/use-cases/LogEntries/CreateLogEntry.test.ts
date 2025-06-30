import { CreateLogEntry } from "../../../../src/use-cases/LogEntries/CreateLogEntry";
import { LogEntryRepository } from "../../../../src/domain/interfaces/logEntryRepository";
import { CreateLogEntryDto } from "../../../../src/interface/dto/CreateLogEntryDto";
import { LogEntry } from "../../../../src/domain/entities/LogEntry";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";

describe("CreateLogEntry", () => {
  let createLogEntry: CreateLogEntry;
  let mockLogEntryRepository: jest.Mocked<LogEntryRepository>;

  beforeEach(() => {
    mockLogEntryRepository = {
      create: jest.fn(),
      findByLogId: jest.fn(),
      findById: jest.fn(),
      findByIdWithExtendedEntities: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validateReference: jest.fn(),
    } as any;

    createLogEntry = new CreateLogEntry(mockLogEntryRepository);
  });

  it("should create a new log entry with place reference", async () => {
    const dto: CreateLogEntryDto = {
      logId: "log1",
      placeId: "place1",
      title: "Visited Eiffel Tower",
      cost: 20,
      timeSpent: "2 hours",
      effortRating: 3,
      rating: 5,
      details: { notes: "Amazing view" },
    };

    const mockEntry = new LogEntry(
      "entry1",
      "log1",
      "place1",
      null,
      "Visited Eiffel Tower",
      20,
      "2 hours",
      3,
      5,
      { notes: "Amazing view" },
      new Date()
    );

    mockLogEntryRepository.create.mockResolvedValue(mockEntry);
    mockLogEntryRepository.validateReference.mockResolvedValue();

    const result = await createLogEntry.execute(dto);

    expect(mockLogEntryRepository.validateReference).toHaveBeenCalledWith("place1", undefined);
    expect(mockLogEntryRepository.create).toHaveBeenCalledWith({
      logId: "log1",
      placeId: "place1",
      transportRouteId: null,
      title: "Visited Eiffel Tower",
      cost: 20,
      timeSpent: "2 hours",
      effortRating: 3,
      rating: 5,
      details: { notes: "Amazing view" },
      createdAt: expect.any(Date),
    });
    expect(result).toEqual(mockEntry);
  });

  it("should create a new log entry with transport reference", async () => {
    const dto: CreateLogEntryDto = {
      logId: "log1",
      transportRouteId: "route1",
      title: "Took the train",
      cost: 50,
      timeSpent: "1 hour",
      details: { class: "first" },
    };

    const mockEntry = new LogEntry(
      "entry2",
      "log1",
      null,
      "route1",
      "Took the train",
      50,
      "1 hour",
      null,
      null,
      { class: "first" },
      new Date()
    );

    mockLogEntryRepository.create.mockResolvedValue(mockEntry);
    mockLogEntryRepository.validateReference.mockResolvedValue();

    const result = await createLogEntry.execute(dto);

    expect(mockLogEntryRepository.validateReference).toHaveBeenCalledWith(undefined, "route1");
    expect(result.transportRouteId).toBe("route1");
    expect(result.placeId).toBeNull();
  });

  it("should throw error if references are invalid", async () => {
    const dto: CreateLogEntryDto = {
      logId: "log1",
      placeId: "invalid-place",
      title: "Invalid entry",
    };

    mockLogEntryRepository.validateReference.mockRejectedValue(
      new BadRequestError("Place with ID invalid-place does not exist")
    );

    await expect(createLogEntry.execute(dto)).rejects.toThrow(BadRequestError);
  });

  it("should handle optional fields", async () => {
    const dto: CreateLogEntryDto = {
      logId: "log1",
      title: "Simple entry",
    };

    const mockEntry = new LogEntry(
      "entry3",
      "log1",
      null,
      null,
      "Simple entry",
      null,
      null,
      null,
      null,
      {},
      new Date()
    );

    mockLogEntryRepository.create.mockResolvedValue(mockEntry);
    mockLogEntryRepository.validateReference.mockResolvedValue();

    const result = await createLogEntry.execute(dto);

    expect(result.cost).toBeNull();
    expect(result.details).toEqual({});
  });
});