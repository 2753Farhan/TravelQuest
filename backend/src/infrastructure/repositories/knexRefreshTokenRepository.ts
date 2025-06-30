import { db } from "../database/knex/knexfile.ts";
import { RefreshToken } from "../../domain/entities/RefreshToken.ts";
import { RefreshTokenRepository } from "../../domain/interfaces/RefreshTokenRepository.ts";

export class KnexRefreshTokenRepository implements RefreshTokenRepository {
  async create(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<RefreshToken> {
    const [created] = await db('refresh_tokens')
      .insert({
        user_id: token.userId,
        token: token.token,
        expires_at: token.expiresAt
      })
      .returning('*');
    
    return RefreshToken.fromRaw(created);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await db('refresh_tokens')
      .where('token', token)
      .first();
    
    return result ? RefreshToken.fromRaw(result) : null;
  }

  async revokeToken(tokenId: string): Promise<void> {
    await db('refresh_tokens')
      .where('id', tokenId)
      .update({ revoked_at: db.fn.now() });
  }
}