import { type Request, type Response } from "express";
import { smartFurnitureHookupDTOMapper } from "@presentation/SmartFurnitureHookupDTO";
import { StatusCodes } from "http-status-codes";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";

export class SmartFurnitureHookupController {
  readonly #smartFurnitureHookupService: SmartFurnitureHookupService;

  constructor(smartFurnitureHookupService: SmartFurnitureHookupService) {
    this.#smartFurnitureHookupService = smartFurnitureHookupService;
  }

  async getSmartFurnitureHookups(_req: Request, res: Response) {
    const smartFurnitureHookups =
      await this.#smartFurnitureHookupService.getSmartFurnitureHookups();

    res.status(StatusCodes.OK).json({
      smartFurnitureHookups: smartFurnitureHookups.map((sfh) =>
        smartFurnitureHookupDTOMapper.toDTO(sfh),
      ),
    });
  }

  async getSmartFurnitureHookup(req: Request, res: Response) {
    const smartFurnitureHookup =
      await this.#smartFurnitureHookupService.getSmartFurnitureHookup(
        req.params.id,
      );

    if (smartFurnitureHookup instanceof Error) {
      throw smartFurnitureHookup;
    }

    res
      .status(StatusCodes.OK)
      .json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
  }

  async createSmartFurnitureHookup(req: Request, res: Response) {
    const { name, utilityType, endpoint } = req.body;

    const smartFurnitureHookup =
      await this.#smartFurnitureHookupService.createSmartFurnitureHookup(
        name,
        utilityType,
        endpoint,
      );

    if (smartFurnitureHookup instanceof Error) throw smartFurnitureHookup;

    res
      .status(StatusCodes.CREATED)
      .json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
  }

  async updateSmartFurnitureHookup(req: Request, res: Response) {
    const id = req.params.id;

    const { name, endpoint } = req.body;

    const smartFurnitureHookup =
      await this.#smartFurnitureHookupService.updateSmartFurnitureHookup(
        id,
        name,
        endpoint,
      );

    if (smartFurnitureHookup instanceof Error) throw smartFurnitureHookup;

    res
      .status(StatusCodes.OK)
      .json(smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup));
  }

  async deleteSmartFurnitureHookup(req: Request, res: Response) {
    const result =
      await this.#smartFurnitureHookupService.deleteSmartFurnitureHookup(
        req.params.id,
      );

    if (result instanceof Error) throw result;

    res.status(StatusCodes.NO_CONTENT);
  }
}
