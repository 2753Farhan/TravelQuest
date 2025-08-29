import { TransportRepository } from "../../domain/interfaces/transportRepository"
import { TransportOption } from "../../domain/entities/TransportOption";


export class GetTransportOptions {
    constructor(private readonly transportRepository: TransportRepository) {}

    async execute(): Promise<TransportOption[]> {
        return this.transportRepository.findAllOptions();
    }
}