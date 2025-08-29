import { UserRoles } from "./types";
export const Permissions = {
  USER_MANAGE: 'user:manage',
  CONTENT_MANAGE: 'content:manage',
  SYSTEM_ADMIN: 'system:admin'
};

export const RolePermissions: Record<UserRoles, string[]> = {
  [UserRoles.ADMIN]: [
    Permissions.USER_MANAGE,
    Permissions.CONTENT_MANAGE,
    Permissions.SYSTEM_ADMIN
  ],
  [UserRoles.MODERATOR]: [
    Permissions.CONTENT_MANAGE
  ],
  [UserRoles.TRAVELER]: [],
  [UserRoles.EXPLORER]: []
};