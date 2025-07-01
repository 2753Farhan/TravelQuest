import type { UserRoles,VisibilitySettings , PlaceTypes} from "./core"
export type User = {
  id: string
  username: string
  email: string
  role: UserRoles
  profilePicUrl?: string
  bio?: string
  createdAt: Date
  isVerified: boolean
}

export type UserPreferences = {
  notificationRadius: number
  defaultVisibility: VisibilitySettings
  preferredCategories: PlaceTypes[]
  preferredTransport: string[]
}

export type UserResponse = Omit<User, 'password'> & {
  preferences: UserPreferences
}

export type RegisterUserDto = {
  username: string
  email: string
  password: string
  role?: UserRoles
}

export type LoginUserDto = {
  email: string
  password: string
}

export type UpdateUserDto = {
  profilePicUrl?: string
  bio?: string
}

// For role-based access control
export type UserWithPermissions = User & {
  permissions: string[]
}