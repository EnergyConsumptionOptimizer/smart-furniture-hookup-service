import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";
import { smartFurnitureHookupRepository } from "./dependencies";
import {
  mockSmartFurnitureHookupFridge,
  mockSmartFurnitureHookupKitchenSink,
  mockSmartFurnitureHookupLamp,
} from "../../storage/mockSmartFurnitureHookup";
import { app } from "./app";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

describe("Smart Furniture Hookup REST API", () => {
  const url = "/api/smart-furniture-hookups";

  let smartFridge: SmartFurnitureHookup;
  let smartLamp: SmartFurnitureHookup;

  beforeAll(async () => {
    smartFridge = await smartFurnitureHookupRepository.saveSmartFurnitureHookup(
      mockSmartFurnitureHookupFridge,
    );
    smartLamp = await smartFurnitureHookupRepository.saveSmartFurnitureHookup(
      mockSmartFurnitureHookupLamp,
    );
  });

  describe("GET / - List of smart furniture hookup", () => {
    const getAllRequest = async () => request(app).get(url);

    it("should return smart furniture hookup list when requested ", async () => {
      const response = await getAllRequest();

      expect(response.status).toBe(200);

      const names = response.body["smartFurnitureHookups"]
        .map((sfh: SmartFurnitureHookup) => sfh.name)
        .sort();

      expect(names).toEqual([smartFridge.name, smartLamp.name].sort());
    });
  });

  describe("GET /:id - Retrieve a smart furniture hookup", () => {
    const getByIDRequest = async (id: SmartFurnitureHookupID) =>
      request(app).get(url + "/" + id.value);

    it("should allow to get a smart furniture hookup by giving an existing ID", async () => {
      const response = await getByIDRequest(smartFridge.id);

      expect(response.status).toBe(200);
      expect(response.body["id"]).toBe(smartFridge.id.value);
      expect(response.body["name"]).toBe(smartFridge.name);
      expect(response.body["utilityType"].toLowerCase()).toBe(
        smartFridge.utilityType.toLowerCase(),
      );
      expect(response.body["endpoint"]).toBe(smartFridge.endpoint);
    });

    it("should return 400 when smart furniture hookup ID is not valid", async () => {
      const response = await getByIDRequest({ value: "abc" });

      expect(response.status).toBe(400);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await getByIDRequest({ value: uuidv4() });

      expect(response.status).toBe(404);
    });
  });

  describe("POST / - Create smart furniture hookup", () => {
    const createNewSmartFurnitureHookupRequest = async (sfh?: {
      name?: string;
      utilityType?: string;
      endpoint?: string;
    }) => request(app).post(url).send(sfh);

    const newSmartFurnitureHookup = mockSmartFurnitureHookupKitchenSink;

    it("should create smart furniture hookup when provided valid name, utility type and endpoint", async () => {
      const response = await createNewSmartFurnitureHookupRequest({
        ...newSmartFurnitureHookup,
      });

      expect(response.status).toBe(201);

      expect(response.body["name"]).toBe(newSmartFurnitureHookup.name);
      expect(response.body["utilityType"].toLowerCase()).toBe(
        newSmartFurnitureHookup.utilityType.toLowerCase(),
      );
      expect(response.body["endpoint"]).toBe(
        newSmartFurnitureHookup.endpoint.toLowerCase(),
      );

      await smartFurnitureHookupRepository.removeSmartFurnitureHookup({
        value: response.body["id"],
      });
    });

    it("should return 400 status code when no data is provided", async () => {
      const response = await createNewSmartFurnitureHookupRequest(undefined);

      expect(response.status).toBe(400);
    });

    it("should return 400 status code when required data are not provided", async () => {
      const responseName = await createNewSmartFurnitureHookupRequest({
        name: undefined,
        utilityType: newSmartFurnitureHookup.utilityType,
        endpoint: newSmartFurnitureHookup.endpoint,
      });

      const responseType = await createNewSmartFurnitureHookupRequest({
        name: newSmartFurnitureHookup.name,
        utilityType: undefined,
        endpoint: newSmartFurnitureHookup.endpoint,
      });

      const responseEndpoint = await createNewSmartFurnitureHookupRequest({
        name: newSmartFurnitureHookup.name,
        utilityType: newSmartFurnitureHookup.utilityType,
        endpoint: undefined,
      });

      expect(responseName.status).toBe(400);
      expect(responseType.status).toBe(400);
      expect(responseEndpoint.status).toBe(400);
    });

    it("should return 400 status code when the consumption type provided doesn't exist", async () => {
      const response = await createNewSmartFurnitureHookupRequest({
        name: newSmartFurnitureHookup.name,
        utilityType: "energy",
        endpoint: newSmartFurnitureHookup.endpoint,
      });

      expect(response.status).toBe(400);
    });

    it("should return 409 when name or endpoint are already exists", async () => {
      const responseName = await createNewSmartFurnitureHookupRequest({
        ...newSmartFurnitureHookup,
        utilityType: newSmartFurnitureHookup.utilityType,
        name: smartFridge.name,
      });

      const responseEndpoint = await createNewSmartFurnitureHookupRequest({
        ...newSmartFurnitureHookup,
        endpoint: smartFridge.endpoint,
      });

      expect(responseName.status).toBe(409);
      expect(responseEndpoint.status).toBe(409);
    });
  });

  describe("PATCH /:id/username - Update smart furniture hookup information", () => {
    const updateSmartFurnitureHookupRequest = async (
      id: SmartFurnitureHookupID,
      sfh?: { name?: string; endpoint?: string },
    ) =>
      request(app)
        .patch(url + "/" + id.value)
        .send(sfh);

    let smartFurnitureHookupToUpdate: SmartFurnitureHookup;

    beforeEach(async () => {
      smartFurnitureHookupToUpdate =
        await smartFurnitureHookupRepository.saveSmartFurnitureHookup(
          mockSmartFurnitureHookupKitchenSink,
        );
    });

    afterEach(async () => {
      await smartFurnitureHookupRepository.removeSmartFurnitureHookup(
        smartFurnitureHookupToUpdate.id,
      );
    });

    it("should allow to update information of an existing smart furniture hookup", async () => {
      const newName = "Smart Kitchen Sink";
      const newEndpoint = "192.168.0.10:5999";

      const response = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        {
          name: newName,
          endpoint: newEndpoint,
        },
      );

      expect(response.status).toBe(201);
      expect(response.body["name"]).toBe(newName);
      expect(response.body["endpoint"]).toBe(newEndpoint);
    });

    it("should allow to update partial information of an existing smart furniture hookup", async () => {
      const newName = "Smart Kitchen Sink";
      const newEndpoint = "192.168.0.10:5999";

      const responseNewName = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        { name: newName, endpoint: undefined },
      );

      expect(responseNewName.status).toBe(201);
      expect(responseNewName.body["name"]).toBe(newName);
      expect(responseNewName.body["endpoint"]).toBe(
        smartFurnitureHookupToUpdate.endpoint,
      );

      const responseNewEndpoint = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        { name: undefined, endpoint: newEndpoint },
      );

      expect(responseNewEndpoint.status).toBe(201);
      expect(responseNewEndpoint.body["name"]).toBe(
        smartFurnitureHookupToUpdate.name,
      );
      expect(responseNewEndpoint.body["endpoint"]).toBe(newEndpoint);
    });

    it("should return 400 status code when no data is provided", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        {},
      );

      expect(response.status).toBe(400);
    });

    it("should return 400 when smart furniture hookup ID is not valid", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        { value: "aaa-000-aaa" },
        { name: "Smart Hookup" },
      );

      expect(response.status).toBe(400);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        { value: uuidv4() },
        { name: "Smart Hookup" },
      );

      expect(response.status).toBe(404);
    });

    it("should return 409 when trying to use existing name or endpoint", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        {
          name: smartFridge.name,
        },
      );

      const response2 = await updateSmartFurnitureHookupRequest(
        smartFurnitureHookupToUpdate.id,
        {
          endpoint: smartFridge.endpoint,
        },
      );

      expect(response.status).toBe(409);
      expect(response2.status).toBe(409);
    });
  });

  describe("DELETE /:id/ - Deletes a smart furniture hookup", () => {
    const deleteRequest = async (id: SmartFurnitureHookupID) =>
      request(app).delete(url + "/" + id.value);

    it("should allow to delete a smart furniture hookup", async () => {
      const smartFurnitureHookupToDelete =
        await smartFurnitureHookupRepository.saveSmartFurnitureHookup(
          mockSmartFurnitureHookupKitchenSink,
        );
      const response = await deleteRequest(smartFurnitureHookupToDelete.id);

      expect(response.status).toBe(204);
    });

    it("should return 400 when smart furniture hookup ID is not valid", async () => {
      const response = await deleteRequest({ value: "aaa-000-aaa" });

      expect(response.status).toBe(400);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await deleteRequest({ value: uuidv4() });

      expect(response.status).toBe(404);
    });
  });
});
