import { PostEntity } from "../entities/Post.ts";

export interface PostRepository {
    create(post: PostEntity): Promise<PostEntity>;
    findAll(): Promise<PostEntity[]>
}