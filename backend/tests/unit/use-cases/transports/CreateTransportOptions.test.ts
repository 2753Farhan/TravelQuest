import { CreateTransportOption } from "../../../../src/use-cases/transorts/CreateTransportOptions";
import { TransportRepository } from "../../../../src/domain/interfaces/transportRepository";
import { CreateTransportOptionDto } from "../../../../src/interface/dto/CreateTransportOptionDto";
import { TransportOption } from "../../../../src/domain/entities/TransportOption";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";

describe("CreateTransportOption", () => {
  let createTransportOption: CreateTransportOption;
  let mockTransportRepository: jest.Mocked<TransportRepository>;

  beforeEach(() => {
    mockTransportRepository = {
      createOption: jest.fn(),
      findOptionById: jest.fn(),
      findAllOptions: jest.fn(),
      createRoute: jest.fn(),
      findRouteById: jest.fn(),
      findRoutesBetweenPlaces: jest.fn(),
    } as any;

    createTransportOption = new CreateTransportOption(mockTransportRepository);
  });

  it("should create a new transport option", async () => {
    const dto: CreateTransportOptionDto = {
      transport_type: "flight",
      provider: "Delta Airlines",
      details: { baggage_allowance: "23kg" },
    };

    const mockOption = new TransportOption(
      "trans1",
      "flight",
      "Delta Airlines",
      { baggage_allowance: "23kg" },
      new Date()
    );

    mockTransportRepository.createOption.mockResolvedValue(mockOption);

    const result = await createTransportOption.execute(dto);

    expect(mockTransportRepository.createOption).toHaveBeenCalledWith({
      transport_type: "flight",
      provider: "Delta Airlines",
      details: { baggage_allowance: "23kg" },
    });
    expect(result).toEqual(mockOption);
  });

  it("should handle optional fields", async () => {
    const dto: CreateTransportOptionDto = {
      transport_type: "train",
    };

    const mockOption = new TransportOption(
      "trans2",
      "train",
      null,
      {},
      new Date()
    );

    mockTransportRepository.createOption.mockResolvedValue(mockOption);

    const result = await createTransportOption.execute(dto);

    expect(result.provider).toBeNull();
    expect(result.details).toEqual({});
  });

  it("should throw error if creation fails", async () => {
    const dto: CreateTransportOptionDto = {
      transport_type: "invalid",
    };

    mockTransportRepository.createOption.mockRejectedValue(
      new BadRequestError("Invalid transport type")
    );

    await expect(createTransportOption.execute(dto)).rejects.toThrow(BadRequestError);
  });
});