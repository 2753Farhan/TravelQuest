import { PostEntity } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/interfaces/PostRepository";
import { CreatePostDto } from "../../interface/dto/CreatePostDto";

export class CreatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(postdata: CreatePostDto): Promise<PostEntity> {
        const postData = {
          ...postdata,
          startedAt:new Date(postdata.startedAt),
          endAt: new Date(postdata.endAt)
        };

    console.log("Creating post with data:", postData);
    const postEntity = new PostEntity("", postData.title, postData.content, postData.startedAt, postData.endAt, postData.userId);
    console.log("Post entity created:", postEntity);
    return await this.postRepository.create(postEntity);
  }
}