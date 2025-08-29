# Cefalo Travel Connect API Documentation

## Authentication & Users

### Auth Endpoints

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/auth/register` | POST | 201 Created | Register a new user |
| `/auth/login` | POST | 200 OK | User login |
| `/auth/refresh-token` | POST | 200 OK | Refresh access token |
| `/auth/verify-email/:token` | GET | 200 OK | Verify email address |
| `/auth/logout` | POST | 200 OK | Logout user |

### User Endpoints

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/users/me` | GET | 200 OK | Get current user profile |
| `/users/me` | PATCH | 200 OK | Update current user profile |
| `/users/` | GET | 200 OK | Get all users (Admin only) |

## Travel Logs

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/travel-logs/` | POST | 201 Created | Create new travel log |
| `/travel-logs/:id` | GET | 200 OK | Get travel log by ID |
| `/travel-logs/user/:userId` | GET | 200 OK | Get logs by user |
| `/travel-logs/:id` | PATCH | 200 OK | Update travel log |
| `/travel-logs/:id` | DELETE | 204 No Content | Delete travel log |

## Log Entries

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/log-entries/` | POST | 201 Created | Create log entry |
| `/log-entries/log/:logId` | GET | 200 OK | Get entries for log |
| `/log-entries/:id` | GET | 200 OK | Get entry by ID |

## Places

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/places/` | POST | 201 Created | Create new place |
| `/places/` | GET | 200 OK | Get all places |
| `/places/search` | GET | 200 OK | Search places by name |
| `/places/nearby` | GET | 200 OK | Find nearby places |
| `/places/type/:type` | GET | 200 OK | Get places by type |
| `/places/:id` | GET | 200 OK | Get place by ID |
| `/places/:id` | PATCH | 200 OK | Update place |
| `/places/:id` | DELETE | 204 No Content | Delete place |

## Wishlists

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/wishlists/` | POST | 201 Created | Create wishlist |
| `/wishlists/user/:userId` | GET | 200 OK | Get user's wishlists |
| `/wishlists/:wishlistId/items` | POST | 201 Created | Add item to wishlist |
| `/wishlists/:wishlistId/items` | GET | 200 OK | Get wishlist items |
| `/wishlists/items/:itemId` | DELETE | 204 No Content | Remove item |
| `/wishlists/items/:itemId/toggle` | PATCH | 200 OK | Toggle item status |

## Travel Groups

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/travel-groups/` | POST | 201 Created | Create travel group |
| `/travel-groups/:groupId` | GET | 200 OK | Get group details |
| `/travel-groups/user/:userId` | GET | 200 OK | Get user's groups |
| `/travel-groups/:groupId/members` | POST | 201 Created | Add member |
| `/travel-groups/:groupId/items` | POST | 201 Created | Add trip item |
| `/travel-groups/items/:itemId/vote` | POST | 200 OK | Vote on item |
| `/travel-groups/members/:membershipId/respond` | PATCH | 200 OK | Accept/decline invitation |

## Transport

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/transports/options` | POST | 201 Created | Create transport option |
| `/transports/options` | GET | 200 OK | Get all transport options |
| `/transports/options/:id` | GET | 200 OK | Get option by ID |
| `/transports/routes` | POST | 201 Created | Create transport route |
| `/transports/routes` | GET | 200 OK | Find routes between places |

## Chats

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/chats/` | POST | 201 Created | Create chat message |
| `/chats/group/:groupId` | GET | 200 OK | Get group messages |
| `/chats/thread/:parentId` | GET | 200 OK | Get message threads |

## Notifications

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/notifications/` | POST | 201 Created | Create notification |
| `/notifications/user/:userId` | GET | 200 OK | Get user notifications |
| `/notifications/mark-read` | PATCH | 200 OK | Mark as read |
| `/notifications/user/:userId/mark-all-read` | PATCH | 200 OK | Mark all as read |