import { GetPlaceById } from "../../../../src/use-cases/places/GetPlaceById";
import { PlaceRepository } from "../../../../src/domain/interfaces/placeRepository";
import { Place } from "../../../../src/domain/entities/Place";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";
import { PlaceTypes } from "../../../../src/shared/types.ts";


describe("GetPlaceById Use Case", () => {
  let mockRepository: jest.Mocked<PlaceRepository>;
  let getPlaceById: GetPlaceById;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PlaceRepository>;

    getPlaceById = new GetPlaceById(mockRepository);
  });

  const mockPlace = new Place(
    "123",
    PlaceTypes.ATTRACTION,
    "Eiffel Tower",
    { x: 2.2945, y: 48.8584 },
    "Paris address",
    {},
    new Date()
  );

  it("should return a place when found", async () => {
    mockRepository.findById.mockResolvedValue(mockPlace);

    const result = await getPlaceById.execute("123");

    expect(result).toEqual(mockPlace);
    expect(mockRepository.findById).toHaveBeenCalledWith("123");
  });

  it("should throw NotFoundError when place not found", async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(getPlaceById.execute("123"))
      .rejects.toThrow(NotFoundError);
  });
});