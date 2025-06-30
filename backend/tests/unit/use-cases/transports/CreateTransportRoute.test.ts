import { CreateTransportRoute } from "../../../../src/use-cases/transorts/CreateTransportRoute";
import { TransportRepository } from "../../../../src/domain/interfaces/transportRepository";
import { CreateTransportRouteDto } from "../../../../src/interface/dto/CreateTransportRouteDto";
import { TransportRoute } from "../../../../src/domain/entities/TransportRoute";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";

describe("CreateTransportRoute", () => {
  let createTransportRoute: CreateTransportRoute;
  let mockTransportRepository: jest.Mocked<TransportRepository>;

  beforeEach(() => {
    mockTransportRepository = {
      createRoute: jest.fn(),
      createOption: jest.fn(),
      findOptionById: jest.fn(),
      findAllOptions: jest.fn(),
      findRouteById: jest.fn(),
      findRoutesBetweenPlaces: jest.fn(),
    } as any;

    createTransportRoute = new CreateTransportRoute(mockTransportRepository);
  });

  it("should create a new transport route", async () => {
    const dto: CreateTransportRouteDto = {
      transport_id: "trans1",
      start_place_id: "place1",
      end_place_id: "place2",
      cost: 100,
      duration: "2 hours",
      details: { class: "economy" },
    };

    const mockRoute = new TransportRoute(
      "route1",
      "trans1",
      "place1",
      "place2",
      100,
      "2 hours",
      { class: "economy" },
      new Date()
    );

    mockTransportRepository.createRoute.mockResolvedValue(mockRoute);

    const result = await createTransportRoute.execute(dto);

    expect(mockTransportRepository.createRoute).toHaveBeenCalledWith({
      transport_id: "trans1",
      start_place_id: "place1",
      end_place_id: "place2",
      cost: 100,
      duration: "2 hours",
      details: { class: "economy" },
    });
    expect(result).toEqual(mockRoute);
  });

  it("should handle optional end place", async () => {
    const dto: CreateTransportRouteDto = {
      transport_id: "trans1",
      start_place_id: "place1",
    };

    const mockRoute = new TransportRoute(
      "route2",
      "trans1",
      "place1",
      null,
      null,
      null,
      {},
      new Date()
    );

    mockTransportRepository.createRoute.mockResolvedValue(mockRoute);

    const result = await createTransportRoute.execute(dto);

    expect(result.end_place_id).toBeNull();
  });

  it("should throw error if creation fails", async () => {
    const dto: CreateTransportRouteDto = {
      transport_id: "invalid",
      start_place_id: "place1",
    };

    mockTransportRepository.createRoute.mockRejectedValue(
      new BadRequestError("Invalid transport ID")
    );

    await expect(createTransportRoute.execute(dto)).rejects.toThrow(BadRequestError);
  });
});