import { PostEntity } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/interfaces/PostRepository";
import { CreatePostDto } from "../../interface/dto/CreatePostDto";

export class CreatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postData: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity("", postData.title, postData.content, postData.userId);
    return await this.postRepository.create(postEntity);
  }
}