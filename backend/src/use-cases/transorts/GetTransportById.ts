
import { TransportOption } from "../../domain/entities/TransportOption";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
export class GetTransportById {
    constructor(private readonly transportRepository: TransportRepository) {}

    async execute(transportId: string): Promise<TransportOption>{
        const transport = await this.transportRepository.findOptionById(transportId);
        if (!transport) {
            throw new Error("Transport not found");
        }   
        return transport;
    }
}