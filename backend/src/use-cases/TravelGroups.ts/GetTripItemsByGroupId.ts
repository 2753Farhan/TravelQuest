import { TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";

export class GetTripItemByGroupId {
    constructor(private readonly repository: TravelGroupRepository) {} 
    async execute(groupId: string): Promise<TripItem[]> {
        const items = await this.repository.findItemsByGroup(groupId);
        return items;
    }
}