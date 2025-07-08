import { TransportRoute } from "../../domain/entities/TransportRoute";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
export class FindRouteById {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(transportId : string): Promise<TransportRoute | null> {
    return this.transportRepo.findRouteById(transportId);
  }
}