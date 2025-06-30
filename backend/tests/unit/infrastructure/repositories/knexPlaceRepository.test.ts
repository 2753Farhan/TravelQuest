import { KnexPlaceRepository } from "../../../../src/infrastructure/repositories/knexPlaceRepository";
import { db } from "../../../../src/infrastructure/database/knex/knexfile";
import { Place } from "../../../../src/domain/entities/Place";
import { PlaceTypes } from "../../../../src/shared/types";
import { BadRequestError } from "../../../../src/interface/errors/BadRequestError";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";


jest.mock("../../../../src/infrastructure/database/knex/knexfile");

describe("KnexPlaceRepository", () => {
  let repository: KnexPlaceRepository;
  const mockPlace = {
    place_id: "1",
    type: PlaceTypes.ATTRACTION,
    name: "Test Place",
    x: 0,
    y: 0,
    created_at: new Date()
  };

  beforeEach(() => {
    repository = new KnexPlaceRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a place successfully", async () => {
      const mockInsert = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([mockPlace]);

      (db as jest.Mocked<any>).mockReturnValue({
        insert: mockInsert.mockReturnValue({
          returning: mockReturning
        })
      });

      const result = await repository.create({
        type: PlaceTypes.ATTRACTION,
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        details : {}
      });

      expect(result).toEqual(Place.fromRaw(mockPlace));
      expect(mockInsert).toHaveBeenCalledWith({
        type: PlaceTypes.ATTRACTION,
        name: "Test Place",
        geo_coordinates: expect.any(Object),
        address: undefined,
        details: {}
      });
    });

    it("should throw BadRequestError on database error", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error("DB error"))
      });

      await expect(repository.create({
        type: PlaceTypes.ATTRACTION,
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        details: {}
      })).rejects.toThrow(BadRequestError);
    });
  });

  describe("findById", () => {
    it("should return a place if found", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockPlace)
      });

      const result = await repository.findById("1");
      expect(result).toEqual(Place.fromRaw(mockPlace));
    });

    it("should return null if place not found", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.findById("1");
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all places", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockResolvedValue([mockPlace])
      });

      const result = await repository.findAll();
      expect(result).toEqual([Place.fromRaw(mockPlace)]);
    });
  });

  describe("findByType", () => {
    it("should return places filtered by type", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockPlace])
      });

      const result = await repository.findByType(PlaceTypes.ATTRACTION);
      expect(result).toEqual([Place.fromRaw(mockPlace)]);
    });
  });

  describe("searchByName", () => {
    it("should return places matching name search", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockPlace])
      });

      const result = await repository.searchByName("test");
      expect(result).toEqual([Place.fromRaw(mockPlace)]);
    });
  });

  describe("searchNearby", () => {
    it("should return nearby places", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        whereRaw: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => callback([mockPlace]))
      });

      const result = await repository.searchNearby({ x: 0, y: 0 }, 1000);
      expect(result).toEqual([Place.fromRaw(mockPlace)]);
    });
  });

  describe("update", () => {
    it("should update a place successfully", async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([mockPlace]);

      (db as jest.Mocked<any>).mockReturnValue({
        where: mockUpdate.mockReturnValue({
          update: jest.fn().mockReturnThis(),
          returning: mockReturning
        })
      });

      const result = await repository.update("1", { name: "Updated" });
      expect(result).toEqual(Place.fromRaw(mockPlace));
    });

    it("should throw NotFoundError if place not found", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([])
      });

      await expect(repository.update("1", { name: "Updated" }))
        .rejects.toThrow(NotFoundError);
    });

    it("should handle geo_coordinates update", async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockReturning = jest.fn().mockResolvedValue([mockPlace]);

      (db as jest.Mocked<any>).mockReturnValue({
        where: mockUpdate.mockReturnValue({
          update: jest.fn().mockReturnThis(),
          returning: mockReturning
        })
      });

      await repository.update("1", { 
        geo_coordinates: { x: 1, y: 1 } 
      });
      
      expect(mockUpdate.mock.calls[0][0]).toEqual("place_id");
    });
  });

  describe("delete", () => {
    it("should delete a place successfully", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        delete: jest.fn().mockResolvedValue(1)
      });

      const result = await repository.delete("1");
      expect(result).toBe(true);
    });

    it("should throw NotFoundError if place not found", async () => {
      (db as jest.Mocked<any>).mockReturnValue({
        where: jest.fn().mockReturnThis(),
        delete: jest.fn().mockResolvedValue(0)
      });

      await expect(repository.delete("1"))
        .rejects.toThrow(NotFoundError);
    });
  });
});