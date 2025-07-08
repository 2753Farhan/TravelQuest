export class PostEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly startedAt: Date ,
    public readonly endAt: Date,
    public readonly userId: string, // Confirm this is userId
    public readonly createdAt: Date = new Date()
  ) {}

  static fromRaw(post: any): PostEntity {
    return new PostEntity(post.id, post.title, post.content, post.start_date, post.end_date, post.user_id, post.created_at);
  }
}


export type Post = {
  id: string;
  title: string;
  content: string;
  start_date: Date;
  end_date: Date;
  userId: string;
  createdAt: Date;
};