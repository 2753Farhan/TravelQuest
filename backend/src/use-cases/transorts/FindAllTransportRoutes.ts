import { TransportRoute } from "../../domain/entities/TransportRoute";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
export class FindAllTransportRoutes {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(): Promise<TransportRoute[]> {
    return this.transportRepo.findAllRoutes();
  }
}