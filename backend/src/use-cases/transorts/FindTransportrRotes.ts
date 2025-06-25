import { TransportRoute } from "../../domain/entities/TransportRoute";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
export class FindTransportRoutes {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(startPlaceId: string, endPlaceId: string): Promise<TransportRoute[]> {
    return this.transportRepo.findRoutesBetweenPlaces(startPlaceId, endPlaceId);
  }
}