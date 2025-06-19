import { db } from "../database/knex/knexfile";
import { User, UserEntity } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import { BadRequestError } from "../../interface/errors/BadRequestError";
import { PostEntity } from "../../domain/entities/Post";

export class KnexUserRepository implements UserRepository {
  async create(user: UserEntity): Promise<User> {
    try {
      const [createdUser] = await db("users")
        .insert({
          id: user.id || db.raw("gen_random_uuid()"),
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        })
        .returning("*");
      return new UserEntity(createdUser.id, createdUser.name, createdUser.email, createdUser.created_at);
    } catch (error) {
      throw new BadRequestError("Failed to create User");
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const results = await db("users")
        .leftJoin("posts", "users.id", "posts.user_id")
        .select(
          "users.id as user_id", // Alias users.id to avoid conflict
          "users.name",
          "users.email",
          "users.created_at",
          "posts.id as post_id", // Alias posts.id
          "posts.title",
          "posts.content",
          "posts.user_id as posts_user_id",
          "posts.created_at as post_created_at"
        );

      const usersMap: { [key: string]: UserEntity } = {};
      results.forEach(row => {
        const userId = row.user_id; // Use the aliased users.id
        let user = usersMap[userId];
        if (!user) {
          user = new UserEntity(userId, row.name, row.email, row.created_at);
          usersMap[userId] = user;
        }
        if (row.post_id) { // Check if post data exists
          user.posts.push(PostEntity.fromRaw({
            id: row.post_id,
            title: row.title,
            content: row.content,
            user_id: row.posts_user_id,
            created_at: row.post_created_at
          }));
        }
      });

      return Object.values(usersMap);
    } catch (error) {
      throw new BadRequestError("Failed to fetch Users");
    }
  }

  async findById(id: string): Promise<UserEntity> {
    try {
      const [user] = await db("users").where({ id }).select("*");
      if (!user) throw new Error("User not found");

      const posts = await db("posts").where({ user_id: id }).select("*");
      const userEntity = new UserEntity(user.id, user.name, user.email, user.created_at);
      userEntity.posts = posts.map(post => PostEntity.fromRaw(post));

      return userEntity;
    } catch (error) {
      throw new BadRequestError("Failed to fetch User");
    }
  }
}