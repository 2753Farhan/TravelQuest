import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { ConflictError } from "../../interface/errors/ConflictError";
import { UserRoles } from "../../shared/types";

export class SwitchRole {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(id: string, newRole: UserRoles
  ): Promise<User> {
    // Validate the new role
    if (!Object.values(UserRoles).includes(newRole)) {
      throw new ConflictError(`Invalid role: ${newRole}`);
    }

    // Switch the user's role
    const updatedUser = await this.userRepository.switchRole(id, newRole);
    
    return updatedUser;
  }
}