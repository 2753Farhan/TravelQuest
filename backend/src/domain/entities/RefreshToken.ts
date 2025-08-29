export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date = new Date(),
    public readonly revokedAt?: Date
  ) {}

  get isActive(): boolean {
    return !this.revokedAt && new Date() < this.expiresAt;
  }

  static fromRaw(raw: any): RefreshToken {
    return new RefreshToken(
      raw.id,
      raw.user_id,
      raw.token,
      new Date(raw.expires_at),
      new Date(raw.created_at),
      raw.revoked_at ? new Date(raw.revoked_at) : undefined
    );
  }
}