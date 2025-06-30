import { DeletePlace } from "../../../../src/use-cases/places/DeletePlace";
import { PlaceRepository } from "../../../../src/domain/interfaces/placeRepository";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";

describe("DeletePlace", () => {
  let deletePlace: DeletePlace;
  let mockPlaceRepository: jest.Mocked<PlaceRepository>;

  beforeEach(() => {
    mockPlaceRepository = {
      delete: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findByType: jest.fn(),
      searchByName: jest.fn(),
      searchNearby: jest.fn(),
      update: jest.fn(),
    } as any;

    deletePlace = new DeletePlace(mockPlaceRepository);
  });

  it("should delete an existing place", async () => {
    mockPlaceRepository.delete.mockResolvedValue(true);

    const result = await deletePlace.execute("1");

    expect(mockPlaceRepository.delete).toHaveBeenCalledWith("1");
    expect(result).toBe(true);
  });

  it("should throw NotFoundError if place doesn't exist", async () => {
    mockPlaceRepository.delete.mockRejectedValue(new NotFoundError("Place not found"));

    await expect(deletePlace.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });

  it("should return false if deletion fails silently", async () => {
    mockPlaceRepository.delete.mockResolvedValue(false);

    const result = await deletePlace.execute("1");

    expect(result).toBe(false);
  });
});