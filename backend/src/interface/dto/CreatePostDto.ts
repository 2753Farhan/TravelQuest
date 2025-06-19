import { IsString, MinLength, MaxLength, IsUUID } from "class-validator";
import { PostEntity } from "../../domain/entities/Post";

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @IsString()
  content!: string;

  @IsUUID() // Validates that userId is a valid UUID
  userId!: string; // Changed from userId to user_Id to match the request
}

export class PostResponseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly userId: string, // Keep as userId for consistency with PostEntity
    public readonly createdAt: Date
  ) {}

  static fromDomain(post: PostEntity): PostResponseDto {
    return new PostResponseDto(
      post.id,
      post.title,
      post.content,
      post.userId, // Changed from post.user_Id to post.userId to match PostEntity
      post.createdAt
    );
  }
}