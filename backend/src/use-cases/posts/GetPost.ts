import { PostEntity } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/interfaces/PostRepository";

export class GetPosts {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(): Promise<PostEntity[]> {
    return await this.postRepository.findAll();
  }
}