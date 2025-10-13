import { NextFunction, type Request, type Response } from "express";
import { SmartFurnitureHookupService } from "../../../domain/ports/SmartFurnitureHookupService";
import { smartFurnitureHookupDTOMapper } from "../../../presentation/SmartFurnitureHookupDTO";
import { SmartFurnitureHookupNotFoundError } from "../../../domain/errors/errors";

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
      const { id } = request.params;

      const smartFurnitureHookup =
        await this.smartFurnitureHookupService.getSmartFurnitureHookup({
          value: id,
        });

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
      if (!request.body) {
        response.status(400).json({ error: "Request body is missing" });
        return;
      }

      const { name, utilityType, endpoint } = request.body;

      if (!name || !utilityType || !endpoint) {
        response
          .status(400)
          .json({ error: "name, utility type and endpoint are required" });
        return;
      }

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
      const { id } = request.params;

      if (!request.body) {
        response.status(400).json({ error: "Request body is missing" });
        return;
      }

      const { name, endpoint } = request.body;

      if (!name && !endpoint) {
        response.status(400).json({ error: "Update at least one param" });
        return;
      }

      const smartFurnitureHookup =
        await this.smartFurnitureHookupService.updateSmartFurnitureHookup(
          { value: id },
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
      const { id } = request.params;
      await this.smartFurnitureHookupService.deleteSmartFurnitureHookup({
        value: id,
      });

      response
        .status(204)
        .json({ message: "Smart furniture hookup deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
