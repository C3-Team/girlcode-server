const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeInventoriesArray } = require("./inventories.fixtures");
describe("Inventories Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("inventories").truncate());
  afterEach("cleanup", () => db("inventories").truncate());

  describe("GET /api/inventories", () => {
    context("Given no inventories", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/inventories")
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
    context("Given there are inventories in the database", () => {
      const testInventories = makeInventoriesArray();

      beforeEach("insert inventories", () => {
        return db.into("inventories").insert(testInventories);
      });
      it(" responds with 200 and all the inventories", () => {
        return supertest(app)
          .get("/api/inventories")
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, testInventories);
      });
    });
  });

  describe("GET  /inventories/:inventories_id", () => {
    context("Given no inventories", () => {
      it("responds with 404", () => {
        const inventoryId = 123456;
        return supertest(app)
          .get(`/api/inventories/${inventoryId}`)
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Inventory doesn't exist" } });
      });
    });

    context("Given there are inventories in the database", () => {
      const testInventories = makeInventoriesArray();
      beforeEach("insert inventories", () => {
        return db.into("inventories").insert(testInventories);
      });
      it(" responds with 200 and the specified inventory", () => {
        const inventoryId = 2;
        const expectedInventory = testInventories[inventoryId - 1];
        return supertest(app)
          .get(`/api/inventories/${inventoryId}`)
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, expectedInventory);
      });
    });
  });
});
