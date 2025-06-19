import { Router } from "express";
import { PostController } from "../controllers/postController";
import { KnexPostRepository } from "../../infrastructure/repositories/knexPostRepository";
import { CreatePost } from "../../use-cases/posts/CreatePost";
import { GetPosts } from "../../use-cases/posts/GetPost";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

const postRepository = new KnexPostRepository();
const createPost = new CreatePost(postRepository);
const getPosts = new GetPosts(postRepository);
const postController = new PostController(createPost, getPosts);

router.post("/", asyncHandler(postController.create.bind(postController)));
router.get("/", asyncHandler(postController.findAll.bind(postController)));

export default router;