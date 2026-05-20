import { beforeEach, describe, expect, it } from "vitest";
import { mock, type MockProxy } from "vitest-mock-extended";
import { SmartFurnitureHookupController } from "@presentation/rest/controllers/SmartFurnitureHookupController";
import { SmartFurnitureHookupService } from "@application/inbound/SmartFurnitureHookupService";
import {
  mockSmartFurnitureHookupBathroomSink,
  mockSmartFurnitureHookupKitchenSink,
} from "@test/unit/presentation/controllers/mockData";
import { mockRequest } from "@test/unit/presentation/controllers/mockRequest";
import { mockResponse } from "@test/unit/presentation/controllers/mockResponse";
import { StatusCodes } from "http-status-codes";
import { smartFurnitureHookupDTOMapper } from "@presentation/SmartFurnitureHookupDTO";
import { SmartFurnitureHookupNotFoundError } from "@domain/errors";

describe("Smart Furniture Hookup REST API", () => {
  let smartFurnitureHookupService: MockProxy<SmartFurnitureHookupService>;
  let controller: SmartFurnitureHookupController;

  beforeEach(async () => {
    smartFurnitureHookupService = mock<SmartFurnitureHookupService>();
    controller = new SmartFurnitureHookupController(
      smartFurnitureHookupService,
    );
  });

  describe("List of smart furniture hookup", () => {
    it("should return smart furniture hookup list when requested ", async () => {
      const smartFurnitureHookups = [
        mockSmartFurnitureHookupBathroomSink,
        mockSmartFurnitureHookupKitchenSink,
      ];
      smartFurnitureHookupService.getSmartFurnitureHookups.mockResolvedValue(
        smartFurnitureHookups,
      );

      const req = mockRequest();
      const res = mockResponse();

      await controller.getSmartFurnitureHookups(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        smartFurnitureHookups: smartFurnitureHookups.map((sfh) =>
          smartFurnitureHookupDTOMapper.toDTO(sfh),
        ),
      });
    });
  });

  describe("Retrieve a smart furniture hookup", () => {
    it("should allow to get a smart furniture hookup by giving an existing ID", async () => {
      const smartFurnitureHookup = mockSmartFurnitureHookupBathroomSink;
      const id = smartFurnitureHookup.id.toString();
      smartFurnitureHookupService.getSmartFurnitureHookup.mockResolvedValue(
        smartFurnitureHookup,
      );

      const req = mockRequest({ params: { id: id } });
      const res = mockResponse();

      await controller.getSmartFurnitureHookup(req, res);

      expect(
        smartFurnitureHookupService.getSmartFurnitureHookup,
      ).toHaveBeenCalledWith(id);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup),
      );
    });

    it("should throw SmartFurnitureHookupNotFoundError when smart furniture hookup is not found", async () => {
      const error = new SmartFurnitureHookupNotFoundError();
      smartFurnitureHookupService.getSmartFurnitureHookup.mockResolvedValue(
        error,
      );

      const req = mockRequest({ params: { id: "unknown-id" } });
      const res = mockResponse();

      await expect(
        controller.getSmartFurnitureHookup(req, res),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });

  describe("Create a smart furniture hookup", () => {
    it("should create a smart furniture hookup and return 201", async () => {
      const smartFurnitureHookup = mockSmartFurnitureHookupBathroomSink;
      smartFurnitureHookupService.createSmartFurnitureHookup.mockResolvedValue(
        smartFurnitureHookup,
      );

      const req = mockRequest({
        body: {
          name: smartFurnitureHookup.name.toString(),
          utilityType: smartFurnitureHookup.utilityType.toString(),
          endpoint: smartFurnitureHookup.endpoint.toString(),
        },
      });
      const res = mockResponse();

      await controller.createSmartFurnitureHookup(req, res);

      expect(
        smartFurnitureHookupService.createSmartFurnitureHookup,
      ).toHaveBeenCalledWith(
        smartFurnitureHookup.name.toString(),
        smartFurnitureHookup.utilityType.toString(),
        smartFurnitureHookup.endpoint.toString(),
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(
        smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup),
      );
    });

    it("should throw when service returns a domain error", async () => {
      const error = new SmartFurnitureHookupNotFoundError();
      smartFurnitureHookupService.createSmartFurnitureHookup.mockResolvedValue(
        error,
      );

      const req = mockRequest({
        body: { name: "", utilityType: "", endpoint: "" },
      });
      const res = mockResponse();

      await expect(
        controller.createSmartFurnitureHookup(req, res),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });

  describe("Update a smart furniture hookup", () => {
    it("should update a smart furniture hookup and return 200", async () => {
      const smartFurnitureHookup = mockSmartFurnitureHookupBathroomSink;
      const id = smartFurnitureHookup.id.toString();
      smartFurnitureHookupService.updateSmartFurnitureHookup.mockResolvedValue(
        smartFurnitureHookup,
      );

      const req = mockRequest({
        params: { id },
        body: {
          name: smartFurnitureHookup.name.toString(),
          endpoint: smartFurnitureHookup.endpoint.toString(),
        },
      });
      const res = mockResponse();

      await controller.updateSmartFurnitureHookup(req, res);

      expect(
        smartFurnitureHookupService.updateSmartFurnitureHookup,
      ).toHaveBeenCalledWith(
        id,
        smartFurnitureHookup.name.toString(),
        smartFurnitureHookup.endpoint.toString(),
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(
        smartFurnitureHookupDTOMapper.toDTO(smartFurnitureHookup),
      );
    });

    it("should throw SmartFurnitureHookupNotFoundError when updating a non-existing hookup", async () => {
      const error = new SmartFurnitureHookupNotFoundError();
      smartFurnitureHookupService.updateSmartFurnitureHookup.mockResolvedValue(
        error,
      );

      const req = mockRequest({
        params: { id: "unknown-id" },
        body: { name: "New Name" },
      });
      const res = mockResponse();

      await expect(
        controller.updateSmartFurnitureHookup(req, res),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });

  describe("Delete a smart furniture hookup", () => {
    it("should delete a smart furniture hookup and return 204", async () => {
      const id = mockSmartFurnitureHookupBathroomSink.id.toString();
      smartFurnitureHookupService.deleteSmartFurnitureHookup.mockResolvedValue(
        undefined,
      );

      const req = mockRequest({ params: { id } });
      const res = mockResponse();

      await controller.deleteSmartFurnitureHookup(req, res);

      expect(
        smartFurnitureHookupService.deleteSmartFurnitureHookup,
      ).toHaveBeenCalledWith(id);
      expect(res.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    });

    it("should throw SmartFurnitureHookupNotFoundError when deleting a non-existing hookup", async () => {
      const error = new SmartFurnitureHookupNotFoundError();
      smartFurnitureHookupService.deleteSmartFurnitureHookup.mockResolvedValue(
        error,
      );

      const req = mockRequest({ params: { id: "unknown-id" } });
      const res = mockResponse();

      await expect(
        controller.deleteSmartFurnitureHookup(req, res),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });
});
