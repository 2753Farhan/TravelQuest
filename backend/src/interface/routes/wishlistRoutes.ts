import { Router } from "express";
import { WishlistController } from "../controllers/wishlistController";
import { KnexWishlistRepository } from "../../infrastructure/repositories/knexWishlistRepository";
import { CreateWishlist } from "../../use-cases/wishlist/createWishlist";
import { AddWishlistItem } from "../../use-cases/wishlist/AddWishlistItem";
import { GetUserWishlists } from "../../use-cases/wishlist/GetUserWishlists";
import { GetWishlistItems } from "../../use-cases/wishlist/GetWishListItems";
import { RemoveWishlistItem } from "../../use-cases/wishlist/RemoveWishListItem";
import { ToggleWishlistItemStatus } from "../../use-cases/wishlist/ToggleWishListItemStatus";
import { FindNearbyWishlistItems } from "../../use-cases/wishlist/FindNearbyWishlistItems";
import { FindOverlappingWishlists } from "../../use-cases/wishlist/FindOverLappingWishList";
const router = Router();
const repository = new KnexWishlistRepository();
const controller = new WishlistController(
  new CreateWishlist(repository),
  new AddWishlistItem(repository),
  new GetUserWishlists(repository),
  new GetWishlistItems(repository),
  new RemoveWishlistItem(repository),
  new ToggleWishlistItemStatus(repository),
  new FindNearbyWishlistItems(repository),
  new FindOverlappingWishlists(repository)
);

router.post("/", controller.create);
router.post("/:wishlistId/items", controller.addItem.bind(controller));
router.get("/user/:userId",controller.getUserWishlists.bind(controller));
router.get("/:wishlistId/items", controller.getWishlistItems.bind(controller));
router.delete("/items/:itemId", controller.deleteItem.bind(controller));
router.patch("/items/:itemId/toggle", controller.toggleItemStatus.bind(controller));
router.get("/user/:userId/nearby", controller.findNearby.bind(controller));
router.get("/user/:userId/overlapping", controller.findOverlappingWishlists.bind(controller));export default router;