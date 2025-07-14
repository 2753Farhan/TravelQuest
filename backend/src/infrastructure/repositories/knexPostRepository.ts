import { db } from "../database/knex/knexfile";
import { Post, PostEntity } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/interfaces/PostRepository";
import { BadRequestError } from "../../interface/errors/BadRequestError";

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

    
    


    async findAll(): Promise<PostEntity[]> {
        
        try {
            const posts = await db('posts').select('*');
            return posts.map(post => PostEntity.fromRaw(post));
        } catch (error) {
            throw new BadRequestError("Failed to fetch Posts");
        }
    }
}
