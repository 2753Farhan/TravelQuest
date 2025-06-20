// src/use-cases/places/CreatePlace.ts
import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";
import { CreatePlaceDto } from "../../interface/dto/CreatePlaceDto";

export class CreatePlace {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(placeData: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.create({
      type: placeData.type,
      name: placeData.name,
      geo_coordinates: { x: placeData.x, y: placeData.y },
      address: placeData.address,
      details: placeData.details || {}
    });
  }
}