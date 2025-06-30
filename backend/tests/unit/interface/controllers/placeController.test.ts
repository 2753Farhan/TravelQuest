import { Request, Response } from 'express';
import { PlaceController } from '../../../../src/interface/controllers/placeController';
import { CreatePlace} from '../../../../src/use-cases/places/CreatePlace';
import { UpdatePlace } from '../../../../src/use-cases/places/UpdatePlace';
import { DeletePlace } from '../../../../src/use-cases/places/DeletePlace';
import { FindNearbyPlaces } from '../../../../src/use-cases/places/FindNearbyPlaces';
import { FindPlacesByType } from '../../../../src/use-cases/places/FindPlacesByType';
import { GetPlaceById } from '../../../../src/use-cases/places/GetPlaceById';
import { GetPlaces } from '../../../../src/use-cases/places/GetPlaces';
import { SearchPlacesByName } from '../../../../src/use-cases/places/SearchPlacesByName';
import { BadRequestError} from '../../../../src/interface/errors/BadRequestError';
import { NotFoundError } from '../../../../src/interface/errors/NotFoundError';
import { PlaceTypes } from '../../../../src/shared/types';
describe('PlaceController', () => {
  let controller: PlaceController;
  let mockCreatePlace: jest.Mocked<CreatePlace>;
  let mockGetPlaceById: jest.Mocked<GetPlaceById>;
  let mockGetPlaces: jest.Mocked<GetPlaces>;
  let mockFindPlacesByType: jest.Mocked<FindPlacesByType>;
  let mockSearchPlacesByName: jest.Mocked<SearchPlacesByName>;
  let mockFindNearbyPlaces: jest.Mocked<FindNearbyPlaces>;
  let mockUpdatePlace: jest.Mocked<UpdatePlace>;
  let mockDeletePlace: jest.Mocked<DeletePlace>;
  
  const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
    body,
    params,
    query
  });

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
  };

  beforeEach(() => {
    mockCreatePlace = { execute: jest.fn() } as any;
    mockGetPlaceById = { execute: jest.fn() } as any;
    mockGetPlaces = { execute: jest.fn() } as any;
    mockFindPlacesByType = { execute: jest.fn() } as any;
    mockSearchPlacesByName = { execute: jest.fn() } as any;
    mockFindNearbyPlaces = { execute: jest.fn() } as any;
    mockUpdatePlace = { execute: jest.fn() } as any;
    mockDeletePlace = { execute: jest.fn() } as any;

    controller = new PlaceController(
      mockCreatePlace,
      mockGetPlaceById,
      mockGetPlaces,
      mockFindPlacesByType,
      mockSearchPlacesByName,
      mockFindNearbyPlaces,
      mockUpdatePlace,
      mockDeletePlace
    );
  });

  describe('create', () => {
    it('should successfully create a place', async () => {
      const req = mockRequest({
        type: PlaceTypes.ATTRACTION,
        name: 'Eiffel Tower',
        x: 2.2945,
        y: 48.8584
      });
      const res = mockResponse();
      
      mockCreatePlace.execute.mockResolvedValue({
        place_id: '123',
        ...req.body,
        geo_coordinates: { x: req.body.x, y: req.body.y },
        created_at: new Date()
      });

      await controller.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION
      }));
    });

    it('should throw BadRequestError for invalid place type', async () => {
      const req = mockRequest({
        type: 'INVALID_TYPE',
        name: 'Invalid Place',
        x: 1,
        y: 1
      });
      const res = mockResponse();

      await expect(controller.create(req as Request, res as Response))
        .rejects.toThrow(BadRequestError);
    });
  });

  describe('getById', () => {
    it('should return place when found', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();
      
      mockGetPlaceById.execute.mockResolvedValue({
        place_id: '123',
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION,
        geo_coordinates: { x: 2.2945, y: 48.8584 },
        details : {},
        created_at: new Date()
      });

      await controller.getById(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        place_id: '123'
      }));
    });

    it('should throw NotFoundError when place not found', async () => {
      const req = mockRequest({}, { id: '999' });
      const res = mockResponse();
  
      mockGetPlaceById.execute.mockRejectedValue(new NotFoundError("Place not found"));

      await expect(controller.getById(req as Request, res as Response))
      .rejects.toThrow(NotFoundError);
    });
    });

  describe('getAll', () => {
    it('should return all places', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      mockGetPlaces.execute.mockResolvedValue([{
        place_id: '123',
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION,
        geo_coordinates: { x: 2.2945, y: 48.8584 },
        details : {},
        created_at: new Date()
      }]);

      await controller.getAll(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Eiffel Tower' })
      ]));
    });

    it('should throw NotFoundError when no places exist', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      mockGetPlaces.execute.mockResolvedValue([]);

      await expect(controller.getAll(req as Request, res as Response))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('getByType', () => {
    it('should return places of specified type', async () => {
      const req = mockRequest({}, { type: PlaceTypes.ATTRACTION });
      const res = mockResponse();
      
      mockFindPlacesByType.execute.mockResolvedValue([{
        place_id: '123',
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION,
        geo_coordinates: { x: 2.2945, y: 48.8584 },
        details: {},
        created_at: new Date()
      }]);

      await controller.getByType(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ type: PlaceTypes.ATTRACTION })
      ]));
    });

    it('should throw NotFoundError when no places of type exist', async () => {
      const req = mockRequest({}, { type: PlaceTypes.DINING });
      const res = mockResponse();
      
      mockFindPlacesByType.execute.mockResolvedValue([]);

      await expect(controller.getByType(req as Request, res as Response))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('search', () => {
    it('should return places matching search query', async () => {
      const req = mockRequest({}, {}, { q: 'eiffel' });
      const res = mockResponse();
      
      mockSearchPlacesByName.execute.mockResolvedValue([{
        place_id: '123',
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION,
        geo_coordinates: { x: 2.2945, y: 48.8584 },
        details: {},
        created_at: new Date()
      }]);

      await controller.search(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Eiffel Tower' })
      ]));
    });

    it('should throw BadRequestError when query is missing', async () => {
      const req = mockRequest({}, {}, {});
      const res = mockResponse();

      await expect(controller.search(req as Request, res as Response))
        .rejects.toThrow(BadRequestError);
    });
  });

  describe('nearby', () => {
    it('should return nearby places', async () => {
      const req = mockRequest({}, {}, { x: '2.2945', y: '48.8584', radius: '1000' });
      const res = mockResponse();
      
      mockFindNearbyPlaces.execute.mockResolvedValue([{
        place_id: '123',
        name: 'Eiffel Tower',
        type: PlaceTypes.ATTRACTION,
        geo_coordinates: { x: 2.2945, y: 48.8584 },
        details: {},
        created_at: new Date()
      }]);

      await controller.nearby(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'Eiffel Tower' })
      ]));
    });

    it('should throw BadRequestError when coordinates are invalid', async () => {
      const req = mockRequest({}, {}, { x: 'invalid', y: 'invalid' });
      const res = mockResponse();

      await expect(controller.nearby(req as Request, res as Response))
        .rejects.toThrow(BadRequestError);
    });
  });
describe('update', () => {
  it('should successfully update a place', async () => {
    const req = mockRequest({ name: 'Updated Name' }, { id: '123' });
    const res = mockResponse();
    
    mockUpdatePlace.execute.mockResolvedValue({
      place_id: '123',
      name: 'Updated Name',
      type: PlaceTypes.ATTRACTION,
      geo_coordinates: { x: 2.2945, y: 48.8584 },
      details: {},
      created_at: new Date(),
      updated_at: new Date()
    });

    await controller.update(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Updated Name'
    }));
  });

  it('should handle not found error', async () => {
    const req = mockRequest({ name: 'Updated Name' }, { id: '999' });
    const res = mockResponse();
    
    // Mock the rejected promise with a properly constructed NotFoundError
    mockUpdatePlace.execute.mockRejectedValue(
      new NotFoundError('Place not found')
    );

    await expect(controller.update(req as Request, res as Response))
      .rejects.toThrow(NotFoundError);
  });
});
  describe('delete', () => {
    it('should successfully delete a place', async () => {
      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();
      
      mockDeletePlace.execute.mockResolvedValue(true);

      await controller.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should throw NotFoundError when place not found', async () => {
      const req = mockRequest({}, { id: '999' });
      const res = mockResponse();
      
      mockDeletePlace.execute.mockResolvedValue(false);

      await expect(controller.delete(req as Request, res as Response))
        .rejects.toThrow(NotFoundError);
    });
  });
});