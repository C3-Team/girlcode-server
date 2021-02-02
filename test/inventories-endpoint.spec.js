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
  describe("POST /api/inventories", () => {
    it("creates an inventory, responding with 201 and the new inventory", function () {
      this.retries(3);
      const newInventory = {
        user_name: "new user4",
        email: "newtest@yahoo.com",
        tampons: 8,
        pads: 6,
        inventory_location: "AZ",
      };
      return supertest(app)
        .post("/api/inventories")
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .send(newInventory)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_name).to.eql(newInventory.user_name);
          expect(res.body.email).to.eql(newInventory.email);
          expect(res.body.tampons).to.equal(newInventory.tampons);
          expect(res.body.pads).to.eql(newInventory.pads);
          expect(res.body.inventory_location).to.eql(
            newInventory.inventory_location
          );
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/inventories/${res.body.id}`);
        });
    });
    const requiredFields = [
      "user_name",
      "email",
      "tampons",
      "pads",
      "inventory_location",
    ];

    requiredFields.forEach((field) => {
      const newInventory = {
        user_name: "new user",
        email: "newneed@gmail.com",
        tampons: 2,
        pads: 5,
        inventory_location: "CA",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newInventory[field];

        return supertest(app)
          .post("/api/inventories")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .send(newInventory)
          .expect(400, {
            error: { message: `Missing '${field}' in request body ` },
          });
      });
    });
  });
  describe("DELETE /inventories/:inventory_id", () => {
    context("Given no inventories", () => {
      it("responds with 404", () => {
        const inventoryId = 123456;
        return supertest(app)
          .delete(`/api/inventories/${inventoryId}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Inventory doesn't exist" } });
      });
    });
    context("Given there are inventories in the database", () => {
      const testInventories = makeInventoriesArray();

      beforeEach("insert inventories", () => {
        return db.into("inventories").insert(testInventories);
      });

      it("responds with 204 and removes the inventory", () => {
        const idToRemove = 2;
        const expectedInventory = testInventories.filter(
          (inventory) => inventory.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/inventories/${idToRemove}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get("/api/inventories")
              .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedInventory)
          );
      });
    });
  });
});
