import { UserRoles } from "../../shared/types";
export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public password: string,
    public readonly role: UserRoles,
    public readonly profilePicUrl?: string,
    public readonly bio?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date,
    public readonly isVerified: boolean = false,
    public readonly refreshToken?: string
  ) {}

  static fromRaw(raw: any): User {
    return new User(
      raw.id,
      raw.username,
      raw.email,
      raw.password_hash,
      raw.role,
      raw.profile_pic_url,
      raw.bio,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : undefined,
      raw.is_verified,
      raw.refresh_token
    );
  }
}