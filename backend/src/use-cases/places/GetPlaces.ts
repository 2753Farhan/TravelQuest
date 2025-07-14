import { Place } from "../../domain/entities/Place";
import { PlaceRepository } from "../../domain/interfaces/placeRepository";


export class GetPlaces {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(options?: { page?: number, limit?: number }): Promise<Place[] | { data: Place[], meta: PaginationMeta }> {
    return this.placeRepository.findAll(options);
  }
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}