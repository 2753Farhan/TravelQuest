import { IsString, MinLength, MaxLength, IsUUID, IsDate, IsDateString } from "class-validator";
import { PostEntity } from "../../domain/entities/Post";

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @IsString()
  content!: string;

  @IsUUID() 
  userId!: string;

  @IsDateString()
    startedAt!: string; 

  @IsDateString()
  endAt!: string; 

}

export class PostResponseDto {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly startedAt: Date,
    public readonly endAt: Date,
    public readonly userId: string,
    public readonly createdAt: Date
  ) {}

  static fromDomain(post: PostEntity): PostResponseDto {
    return new PostResponseDto(
      post.id,
      post.title,
      post.content,
      post.startedAt,
      post.endAt,
      post.userId, 
      post.createdAt
    );
  }
}