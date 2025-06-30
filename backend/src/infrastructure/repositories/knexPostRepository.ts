import { db } from "../database/knex/knexfile.ts";
import { Post, PostEntity } from "../../domain/entities/Post.ts";
import { PostRepository } from "../../domain/interfaces/PostRepository.ts";
import { BadRequestError } from "../../interface/errors/BadRequestError.ts";

export class KnexPostRepository implements PostRepository{
    async create(post: PostEntity): Promise<PostEntity> {
        try {
            const [createdPost] = await db('posts')
            .insert({
                title: post.title,
                content: post.content,
                user_id: post.userId,
                started_at: post.startedAt,
                end_at: post.endAt,

            })
            .returning('*');
            return PostEntity.fromRaw(createdPost);
        } catch (error : any) {
            throw new BadRequestError("Failed to create Post" + error.message);
        }
    }

//   return knex.schema.alterTable('posts', (table) => {
//     table.timestamp('started_at')
//       .nullable()
//       .comment('When the post activity begins');
    
//     table.timestamp('end_at')
//       .nullable()
//       .comment('When the post activity ends');
//   });
    // table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    // table.string("title").notNullable();
    // table.text("content").notNullable();
    // table.uuid("user_id").notNullable().references("id").inTable("users");
    // table.timestamp("created_at").defaultTo(knex.fn.now());


    async findAll(): Promise<PostEntity[]> {
        
        try {
            const posts = await db('posts').select('*');
            return posts.map(post => PostEntity.fromRaw(post));
        } catch (error) {
            throw new BadRequestError("Failed to fetch Posts");
        }
    }
}
