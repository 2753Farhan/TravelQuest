import { GetTransportById } from "../../../../src/use-cases/transorts/GetTransportById";
import { TransportRepository } from "../../../../src/domain/interfaces/transportRepository";
import { TransportOption } from "../../../../src/domain/entities/TransportOption";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";

describe("GetTransportById", () => {
  let getTransportById: GetTransportById;
  let mockTransportRepository: jest.Mocked<TransportRepository>;

  beforeEach(() => {
    mockTransportRepository = {
      findOptionById: jest.fn(),
      createOption: jest.fn(),
      findAllOptions: jest.fn(),
      createRoute: jest.fn(),
      findRouteById: jest.fn(),
      findRoutesBetweenPlaces: jest.fn(),
    } as any;

    getTransportById = new GetTransportById(mockTransportRepository);
  });

  it("should return transport option by ID", async () => {
    const mockOption = new TransportOption(
      "trans1",
      "flight",
      "Delta Airlines",
      { baggage_allowance: "23kg" },
      new Date()
    );

    mockTransportRepository.findOptionById.mockResolvedValue(mockOption);

    const result = await getTransportById.execute("trans1");

    expect(mockTransportRepository.findOptionById).toHaveBeenCalledWith("trans1");
    expect(result).toEqual(mockOption);
  });

  it("should throw error if transport not found", async () => {
    mockTransportRepository.findOptionById.mockResolvedValue(null);

    await expect(getTransportById.execute("nonexistent")).rejects.toThrow(
      "Transport not found"
    );
  });
});