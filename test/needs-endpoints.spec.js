const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeNeedsArray } = require("./needs.fixtures");
describe("Needs Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("needs").truncate());
  afterEach("cleanup", () => db("needs").truncate());

  describe("GET /api/needs", () => {
    context("Given no articles", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/needs")
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
    context("Given there are needs in the database", () => {
      const testNeeds = makeNeedsArray();

      beforeEach("insert needs", () => {
        return db.into("needs").insert(testNeeds);
      });
      it(" responds with 200 and all the needs", () => {
        return supertest(app)
          .get("/api/needs")
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, testNeeds);
      });
    });
  });

  describe("GET  /needs/:need_id", () => {
    context("Given no needs", () => {
      it("responds with 404", () => {
        const needId = 123456;
        return supertest(app)
          .get(`/api/needs/${needId}`)
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Need doesn't exist" } });
      });
    });

    context("Given there are needs in the database", () => {
      const testNeeds = makeNeedsArray();
      beforeEach("insert needs", () => {
        return db.into("needs").insert(testNeeds);
      });
      it(" responds with 200 and the specified need", () => {
        const needId = 2;
        const expectedNeed = testNeeds[needId - 1];
        return supertest(app)
          .get(`/api/needs/${needId}`)
          .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
          .expect(200, expectedNeed);
      });
    });
  });
});
