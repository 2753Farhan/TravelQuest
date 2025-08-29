import { db } from "../database/knex/knexfile";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { BadRequestError } from "../../interface/errors/BadRequestError";
import { NotFoundError } from "../../interface/errors/NotFoundError";
import { UserRoles } from "../../shared/types";

export class KnexUserRepository implements UserRepository {
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const [created] = await db('users')
        .insert({
          username: user.username,
          email: user.email,
          password_hash: user.password,
          role: user.role,
          profile_pic_url: user.profilePicUrl || null,
          bio: user.bio,
          is_verified: user.isVerified
        })
        .returning('*');

      return User.fromRaw(created);
    } catch (error: any) {
      throw new BadRequestError(`Failed to create user: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db('users').where('email', email).first();
    return user ? User.fromRaw(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await db('users').where('username', username).first();
    return user ? User.fromRaw(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await db('users').where('id', id).first();
    return user ? User.fromRaw(user) : null;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const updateData: any = { ...updates };
    if (updates.updatedAt === undefined) {
      updateData.updated_at = db.fn.now();
    }

    const [updated] = await db('users')
      .where('id', id)
      .update(updateData)
      .returning('*');

    if (!updated) throw new NotFoundError('User not found');
    return User.fromRaw(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await db('users').where('id', id).delete();
    return deleted > 0;
  }

  async findAll(role?: string): Promise<User[]> {
    let query = db('users');
    if (role) {
      query = query.where('role', role);
    }
    const users = await query;
    return users.map(User.fromRaw);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await db('users')
      .where('id', id)
      .update({ refresh_token: refreshToken });
  }

  async verifyUser(id: string): Promise<void> {
    await db('users')
      .where('id', id)
      .update({ is_verified: true });
  }

  async switchRole(id: string, newRole: UserRoles): Promise<User> {
    const [updated] = await db('users')
      .where('id', id)
      .update({ role: newRole, updated_at: db.fn.now() })
      .returning('*');

    if (!updated) throw new NotFoundError('User not found');
    return User.fromRaw(updated);
  }


}