import { RefreshToken } from "../entities/RefreshToken";

export interface RefreshTokenRepository {
  create(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeToken(tokenId: string): Promise<void>;
}