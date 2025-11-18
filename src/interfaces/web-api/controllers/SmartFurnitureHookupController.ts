import { NextFunction, type Request, type Response } from "express";
import { SmartFurnitureHookupService } from "@domain/ports/SmartFurnitureHookupService";
import { smartFurnitureHookupDTOMapper } from "@presentation/SmartFurnitureHookupDTO";
import { SmartFurnitureHookupNotFoundError } from "@domain/errors/errors";
import {
  createSmartFurnitureHookupSchema,
  smartFurnitureHookupIDSchema,
  updateSmartFurnitureHookupSchema,
} from "@presentation/SmartFurnitureHookupSchema";

export class SmartFurnitureHookupController {
  constructor(
    private readonly smartFurnitureHookupService: SmartFurnitureHookupService,
  ) {}

  getSmartFurnitureHookups = async (
    _request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const smartFurnitureHookups =
        await this.smartFurnitureHookupService.getSmartFurnitureHookups();

      response.json({
        smartFurnitureHookups: smartFurnitureHookups.map((sfh) =>
          smartFurnitureHookupDTOMapper.toDTO(sfh),
        ),
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getSmartFurnitureHookup = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = smartFurnitureHookupIDSchema.parse(request.params.id);

      const smartFurnitureHookup =
        await this.smartFurnitureHookupService.getSmartFurnitureHookup(id);

      if (!smartFurnitureHookup) {
        return next(new SmartFurnitureHookupNotFoundError());
      }

      response.json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
    } catch (error) {
      next(error);
    }
  };

  createSmartFurnitureHookup = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, utilityType, endpoint } =
        createSmartFurnitureHookupSchema.parse(request.body);

      const smartFurnitureHookup =
        await this.smartFurnitureHookupService.createSmartFurnitureHookup(
          name,
          utilityType,
          endpoint,
        );

      response
        .status(201)
        .json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
    } catch (error) {
      next(error);
    }
  };

  updateSmartFurnitureHookup = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = smartFurnitureHookupIDSchema.parse(request.params.id);

      const { name, endpoint } = updateSmartFurnitureHookupSchema.parse(
        request.body,
      );

      const smartFurnitureHookup =
        await this.smartFurnitureHookupService.updateSmartFurnitureHookup(
          id,
          name,
          endpoint,
        );

      response
        .status(201)
        .json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
    } catch (error) {
      next(error);
    }
  };

  deleteSmartFurnitureHookup = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = smartFurnitureHookupIDSchema.parse(request.params.id);
      await this.smartFurnitureHookupService.deleteSmartFurnitureHookup(id);

      response
        .status(204)
        .json({ message: "Smart furniture hookup deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
