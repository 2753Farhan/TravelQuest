import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePost } from "../../use-cases/posts/CreatePost";
import { GetPosts } from "../../use-cases/posts/GetPost";
import { CreatePostDto, PostResponseDto } from "../dto/CreatePostDto";
import { BadRequestError } from "../errors/BadRequestError";

export class PostController {
  constructor(
    private readonly createPost: CreatePost,
    private readonly getPosts: GetPosts
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreatePostDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; ");
      throw new BadRequestError(message);
    }
    const post = await this.createPost.execute(dto);
    res.status(201).json(PostResponseDto.fromDomain(post));
  }

  async findAll(_req: Request, res: Response): Promise<void> {
    const posts = await this.getPosts.execute();
    res.json(posts.map(PostResponseDto.fromDomain));
  }
}