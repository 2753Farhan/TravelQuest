import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateWishlist } from "../../use-cases/wishlist/createWishlist";
import { AddWishlistItem } from "../../use-cases/wishlist/AddWishlistItem";
import { GetUserWishlists } from "../../use-cases/wishlist/GetUserWishlists";
import { CreateWishlistDto, AddWishlistItemDto, WishlistResponseDto, FindNearbyWishlistItemsDto,OverlappingWishlistResponseDto, FindOverlappingWishlistsDto } from "../dto/WishListDto";
import { RemoveWishlistItem } from "../../use-cases/wishlist/RemoveWishListItem";
import { GetWishlistItems } from "../../use-cases/wishlist/GetWishListItems";
import { ToggleWishlistItemStatus } from "../../use-cases/wishlist/ToggleWishListItemStatus";
import { FindNearbyWishlistItems } from "../../use-cases/wishlist/FindNearbyWishlistItems";
import { FindOverlappingWishlists } from "../../use-cases/wishlist/FindOverLappingWishList";
import { BadRequestError } from "../errors/BadRequestError";
import { asyncHandler } from "../middlewares/asyncHandler";

export class WishlistController {
  constructor(
    private readonly createWishlist: CreateWishlist,
    private readonly addWishlistItem: AddWishlistItem,
    private readonly getUsersWishlists: GetUserWishlists,
    private readonly getWishlistItemsUseCase: GetWishlistItems,
    private readonly removeWishlistItem: RemoveWishlistItem,
    private readonly toggleWishlistItemStatus: ToggleWishlistItemStatus,
    private readonly findNearbyWishlistItems: FindNearbyWishlistItems,
    private readonly findOverlappingWishlistsUseCase: FindOverlappingWishlists
  ) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateWishlistDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const wishlist = await this.createWishlist.execute(dto);
    res.status(201).json(WishlistResponseDto.fromDomain(wishlist));
  });

  addItem = asyncHandler(async (req: Request, res: Response) => {
    const dto = plainToInstance(AddWishlistItemDto, {
      ...req.body,
      wishlistId: req.params.wishlistId
    });
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const item = await this.addWishlistItem.execute(dto);
    res.status(201).json(item);
  });

  getUserWishlists = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId ;
    if (!userId) throw new BadRequestError("User ID required");

    const wishlists = await this.getUsersWishlists.execute(userId);
    res.json(wishlists.map(w => WishlistResponseDto.fromDomain(w)));
  });
  getWishlistItems = asyncHandler(async (req: Request, res: Response) => {
    const wishlistId = req.params.wishlistId;
    if (!wishlistId) throw new BadRequestError("Wishlist ID required");

    const items = await this.getWishlistItemsUseCase.execute(wishlistId);
    res.json(items);
  });
  
  deleteItem = asyncHandler(async (req: Request, res: Response) => {
  
    const itemId = req.params.itemId;

    if ( !itemId) {
      throw new BadRequestError("WishList Item ID required");
    }

    await this.removeWishlistItem.execute( itemId);
    res.status(204).send();
  })

  toggleItemStatus = asyncHandler(async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    if (!itemId) throw new BadRequestError("Wishlist Item ID required");

    const updatedItem = await this.toggleWishlistItemStatus.execute(itemId);
    res.json(updatedItem);
  });

  findNearby = asyncHandler(async(req: Request, res: Response) => {

    const userId = req.params.userId;
    let {x,y,radius} = req.query;
    if (!x || !y || !radius) {
      throw new BadRequestError("x, y, and radius parameters are required");
    }

    if(!userId) throw new BadRequestError("User ID required");


    const dto = plainToInstance(FindNearbyWishlistItemsDto,     {
    x  : parseFloat(x as string),
    y  : parseFloat(y as string),
    radius : parseFloat(radius as string)
    } );
    const errors = await validate(dto);


    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const checkedradius = dto.radius || 5000; 
    const items = await this.findNearbyWishlistItems.execute(
      userId,
      { x: dto.x, y: dto.y },
      checkedradius
    );

    res.json(items);


  })

findOverlappingWishlists = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.params.userId + "  " + req.query.wishlistId);
    const dto = plainToInstance(FindOverlappingWishlistsDto, {
      userId: req.params.userId,
      wishlistId: req.query.wishlistId
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }
    console.log('this is the dto bro: '+ dto);
    const overlaps = await this.findOverlappingWishlistsUseCase.execute(dto);
    console.log("Overlapping wishlists found: ", overlaps);
    res.json(
      overlaps.map(({ wishlist, commonItems }) => ({
        wishlist: wishlist,
        commonItems
      }))
    );
  });
}