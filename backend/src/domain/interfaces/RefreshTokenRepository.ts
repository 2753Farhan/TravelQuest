import { RefreshToken } from "../entities/RefreshToken.ts";

export interface RefreshTokenRepository {
  create(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeToken(tokenId: string): Promise<void>;
}