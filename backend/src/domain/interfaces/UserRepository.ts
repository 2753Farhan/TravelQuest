import { User } from "../entities/User.ts";
import { UserRoles } from "../../shared/types.ts";

export interface UserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;
  findAll(role?: UserRoles): Promise<User[]>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
  verifyUser(id: string): Promise<void>;
}