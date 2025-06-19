import { PostEntity } from "../entities/Post";

export interface PostRepository {
    create(post: PostEntity): Promise<PostEntity>;
    findAll(): Promise<PostEntity[]>
}