import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";

export class GetUserById {
  constructor(private userRepository: KnexUserRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}