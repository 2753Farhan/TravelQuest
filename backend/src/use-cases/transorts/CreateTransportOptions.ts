import { TransportOption } from "../../domain/entities/TransportOption";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
import { CreateTransportOptionDto } from "../../interface/dto/CreateTransportOptionDto";

export class CreateTransportOption {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(data: CreateTransportOptionDto): Promise<TransportOption> {
    return this.transportRepo.createOption({
      transport_type: data.transport_type,
      provider: data.provider || null,
      details: data.details || {}
    });
  }
}