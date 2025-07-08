import { TransportRoute } from "../../domain/entities/TransportRoute";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
export class FindTransportRouteByTranportId {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(transportId : string): Promise<TransportRoute[]> {
    return this.transportRepo.findRoutesByTransportId(transportId);
  }
}