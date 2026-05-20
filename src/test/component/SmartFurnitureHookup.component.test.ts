import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  type ComponentTestContext,
  clearDatabase,
  composeAppForComponentTest,
  startMongo,
  stopMongo,
} from "./setup";

const ADMIN = {
  "X-User-Id": "admin-id",
  "X-User-Role": "ADMIN",
  "X-User-Username": "admin",
};

const HOUSEHOLD = {
  "X-User-Id": "user-1",
  "X-User-Role": "HOUSEHOLD",
  "X-User-Username": "testuser",
};

const UNKNOWN_ID = "99999999-9999-4999-8999-999999999999";

describe("SmartFurnitureHookup Component", () => {
  let ctx: ComponentTestContext;

  beforeAll(startMongo);
  afterAll(stopMongo);

  beforeEach(async () => {
    await clearDatabase();
    ctx = await composeAppForComponentTest();
  });

  describe("Feature: Admin manages smart furniture hookups", () => {
    describe("Scenario: Create smart furniture hookup", () => {
      it("Given valid hookup data, When admin creates, Then returns 201", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Living Room Sensor",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/living-room",
          });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toMatchObject({
          id: expect.any(String) as string,
          name: "Living Room Sensor",
          utilityType: "ELECTRICITY".toLowerCase(),
          endpoint: "https://sensor.example.com/living-room",
        });
      });

      it("Given duplicate name, When admin creates, Then returns 409", async () => {
        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Unique Name",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/first",
          });

        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Unique Name",
            utilityType: "WATER",
            endpoint: "https://sensor.example.com/second",
          });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.code).toBe("UNIQUE_FIELD_ALREADY_EXISTS");
      });

      it("Given duplicate endpoint URL, When admin creates, Then returns 409", async () => {
        const sharedEndpoint = "https://sensor.example.com/shared";

        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "First Hookup",
            utilityType: "ELECTRICITY",
            endpoint: sharedEndpoint,
          });

        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Second Hookup",
            utilityType: "GAS",
            endpoint: sharedEndpoint,
          });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.code).toBe("UNIQUE_FIELD_ALREADY_EXISTS");
      });

      it("Given missing name, When admin creates, Then returns 400", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/room",
          });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("Given missing endpoint, When admin creates, Then returns 400", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Kitchen Sensor",
            utilityType: "ELECTRICITY",
          });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("Given invalid utility type, When admin creates, Then returns 400", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Kitchen Sensor",
            utilityType: "NUCLEAR",
            endpoint: "https://sensor.example.com/kitchen",
          });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.code).toBe("INVALID_UTILITY_TYPE");
      });

      it("Given non-admin user, When creates, Then returns 403", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(HOUSEHOLD)
          .send({
            name: "Kitchen Sensor",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/kitchen",
          });

        expect(res.status).toBe(StatusCodes.FORBIDDEN);
        expect(res.body.code).toBe("FORBIDDEN");
      });

      it("Given no auth headers, When creates, Then returns 401", async () => {
        const res = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .send({
            name: "Kitchen Sensor",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/kitchen",
          });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      });
    });

    describe("Scenario: List smart furniture hookups", () => {
      it("Given existing hookups, When listed, Then returns 200 with all", async () => {
        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Hookup A",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/a",
          });
        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Hookup B",
            utilityType: "GAS",
            endpoint: "https://sensor.example.com/b",
          });

        const res = await request(ctx.app)
          .get("/api/smart-furniture-hookups")
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.smartFurnitureHookups).toHaveLength(2);
      });

      it("Given no hookups, When listed, Then returns 200 with empty array", async () => {
        const res = await request(ctx.app)
          .get("/api/smart-furniture-hookups")
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.smartFurnitureHookups).toEqual([]);
      });

      it("Given no auth headers, When listed, Then returns 401", async () => {
        const res = await request(ctx.app).get("/api/smart-furniture-hookups");

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      });

      it("Given household user, When listed, Then returns 200", async () => {
        const res = await request(ctx.app)
          .get("/api/smart-furniture-hookups")
          .set(HOUSEHOLD);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.smartFurnitureHookups).toEqual([]);
      });
    });

    describe("Scenario: Get smart furniture hookup by ID", () => {
      it("Given existing hookup, When get by ID, Then returns 200", async () => {
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "My Hookup",
            utilityType: "WATER",
            endpoint: "https://sensor.example.com/my",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .get(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toMatchObject({
          id: hookupId,
          name: "My Hookup",
          utilityType: "WATER".toLowerCase(),
          endpoint: "https://sensor.example.com/my",
        });
      });

      it("Given unknown ID, When get by ID, Then returns 404", async () => {
        const res = await request(ctx.app)
          .get(`/api/smart-furniture-hookups/${UNKNOWN_ID}`)
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.code).toBe("NOT_FOUND");
      });

      it("Given no auth headers, When get by ID, Then returns 401", async () => {
        const res = await request(ctx.app).get(
          `/api/smart-furniture-hookups/${UNKNOWN_ID}`,
        );

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      });
    });

    describe("Scenario: Update smart furniture hookup", () => {
      it("Given existing hookup, When admin updates name, Then returns 200", async () => {
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Old Name",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/old",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN)
          .send({ name: "New Name" });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.name).toBe("New Name");
        expect(res.body.endpoint).toBe("https://sensor.example.com/old");
      });

      it("Given existing hookup, When admin updates endpoint, Then returns 200", async () => {
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "My Hookup",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/old",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN)
          .send({ endpoint: "https://sensor.example.com/new" });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.endpoint).toBe("https://sensor.example.com/new");
        expect(res.body.name).toBe("My Hookup");
      });

      it("Given update to duplicate name, When admin updates, Then returns 409", async () => {
        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Existing",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/existing",
          });
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Other",
            utilityType: "WATER",
            endpoint: "https://sensor.example.com/other",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN)
          .send({ name: "Existing" });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.code).toBe("UNIQUE_FIELD_ALREADY_EXISTS");
      });

      it("Given update to duplicate endpoint, When admin updates, Then returns 409", async () => {
        await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Existing",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/taken",
          });
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "Other",
            utilityType: "WATER",
            endpoint: "https://sensor.example.com/other",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN)
          .send({ endpoint: "https://sensor.example.com/taken" });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body.code).toBe("UNIQUE_FIELD_ALREADY_EXISTS");
      });

      it("Given unknown ID, When admin updates, Then returns 404", async () => {
        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${UNKNOWN_ID}`)
          .set(ADMIN)
          .send({ name: "New Name" });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.code).toBe("NOT_FOUND");
      });

      it("Given no auth headers, When updates, Then returns 401", async () => {
        const res = await request(ctx.app)
          .patch(`/api/smart-furniture-hookups/${UNKNOWN_ID}`)
          .send({ name: "New Name" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      });
    });

    describe("Scenario: Delete smart furniture hookup", () => {
      it("Given existing hookup, When admin deletes, Then returns 204", async () => {
        const createRes = await request(ctx.app)
          .post("/api/smart-furniture-hookups")
          .set(ADMIN)
          .send({
            name: "To Delete",
            utilityType: "ELECTRICITY",
            endpoint: "https://sensor.example.com/delete-me",
          });
        const hookupId = createRes.body.id as string;

        const res = await request(ctx.app)
          .delete(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.NO_CONTENT);

        const getRes = await request(ctx.app)
          .get(`/api/smart-furniture-hookups/${hookupId}`)
          .set(ADMIN);

        expect(getRes.status).toBe(StatusCodes.NOT_FOUND);
      });

      it("Given unknown ID, When admin deletes, Then returns 404", async () => {
        const res = await request(ctx.app)
          .delete(`/api/smart-furniture-hookups/${UNKNOWN_ID}`)
          .set(ADMIN);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.code).toBe("NOT_FOUND");
      });

      it("Given no auth headers, When deletes, Then returns 401", async () => {
        const res = await request(ctx.app).delete(
          `/api/smart-furniture-hookups/${UNKNOWN_ID}`,
        );

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
      });
    });
  });

  describe("Feature: Health check", () => {
    it("When health check, Then returns 200 with status ok", async () => {
      const res = await request(ctx.app).get("/health");

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.status).toBe("ok");
    });
  });
});
