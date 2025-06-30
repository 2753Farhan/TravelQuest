import { GetLogEntry } from "../../../../src/use-cases/LogEntries/GetLogEntry";
import { LogEntryRepository } from "../../../../src/domain/interfaces/logEntryRepository";
import { LogEntry } from "../../../../src/domain/entities/LogEntry";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";

describe("GetLogEntry", () => {
  let getLogEntry: GetLogEntry;
  let mockLogEntryRepository: jest.Mocked<LogEntryRepository>;

  beforeEach(() => {
    mockLogEntryRepository = {
      findById: jest.fn(),
      findByIdWithExtendedEntities: jest.fn(),
      create: jest.fn(),
      findByLogId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validateReference: jest.fn(),
    } as any;

    getLogEntry = new GetLogEntry(mockLogEntryRepository);
  });

  it("should return a log entry by ID", async () => {
    const mockEntry = new LogEntry(
      "entry1",
      "log1",
      "place1",
      null,
      "Entry 1",
      10,
      "1 hour",
      2,
      4,
      {},
      new Date()
    );

    mockLogEntryRepository.findById.mockResolvedValue(mockEntry);

    const result = await getLogEntry.execute("entry1");

    expect(mockLogEntryRepository.findById).toHaveBeenCalledWith("entry1");
    expect(result).toEqual(mockEntry);
  });

  it("should throw NotFoundError if entry doesn't exist", async () => {
    mockLogEntryRepository.findById.mockResolvedValue(null);

    await expect(getLogEntry.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });

  it("should return entry with expanded entities when requested", async () => {
    const mockEntry = new LogEntry(
      "entry1",
      "log1",
      "place1",
      "route1",
      "Entry with expanded data",
      10,
      "1 hour",
      2,
      4,
      {},
      new Date()
    );

    const expandedData = {
      logEntry: mockEntry,
      place: {
        placeId: "place1",
        name: "Eiffel Tower",
        type: "attraction",
      },
      transportRoute: {
        routeId: "route1",
        transportType: "train",
      },
    };

    mockLogEntryRepository.findByIdWithExtendedEntities.mockResolvedValue(expandedData);

    const result = await getLogEntry.executeWithExpansion("entry1");

    expect(mockLogEntryRepository.findByIdWithExtendedEntities).toHaveBeenCalledWith("entry1");
    expect(result).toEqual(expandedData);
    expect(result.place).toBeDefined();
    expect(result.transportRoute).toBeDefined();
  });
});