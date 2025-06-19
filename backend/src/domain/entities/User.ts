import { PostEntity } from './Post';
export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public readonly createdAt: Date = new Date(),
    public posts: PostEntity[] = [] // Add this line
  ) {}

  static fromRaw(user: any): UserEntity {
    return new UserEntity(user.id, user.name, user.email, user.created_at, []);
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  posts: PostEntity[]; // Add this line
};