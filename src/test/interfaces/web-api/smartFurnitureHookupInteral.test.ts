import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { SmartFurnitureHookup } from "@domain/SmartFurnitureHookup";
import { smartFurnitureHookupRepository } from "./dependencies";
import { mockSmartFurnitureHookupFridge } from "../../storage/mockSmartFurnitureHookup";
import { app } from "./app";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";

describe("Smart Furniture Hookup internal REST API", () => {
  const url = "/api/internal/smart-furniture-hookups";

  let smartFridge: SmartFurnitureHookup;

  beforeAll(async () => {
    smartFridge = await smartFurnitureHookupRepository.saveSmartFurnitureHookup(
      mockSmartFurnitureHookupFridge,
    );
  });

  describe("GET /:id - Retrieve a smart furniture hookup", () => {
    const getByIDRequest = async (id: SmartFurnitureHookupID) =>
      request(app).get(url + "/" + id.value);

    it("should allow to get a smart furniture hookup by giving an existing ID", async () => {
      const response = await getByIDRequest(smartFridge.id);

      expect(response.status).toBe(200);
      expect(response.body["id"]).toBe(smartFridge.id.value);
    });
  });
});
