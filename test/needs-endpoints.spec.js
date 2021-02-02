const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

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
  context("Given there are needs in the database", () => {
    const testNeeds = [
      {
        id: 1,
        user_name: "test user1",
        email: "this@yahoo.com",
        tampons: "3",
        pads: "5",
        need_location: "TX",
      },
      {
        id: 2,
        user_name: "test user2",
        email: "that@yahoo.com",
        tampons: "5",
        pads: "7",
        need_location: "AL",
      },
      {
        id: 3,
        user_name: "test user3",
        email: "those@yahoo.com",
        tampons: "15",
        pads: "5",
        need_location: "AR",
      },
      {
        id: 4,
        user_name: "test user4",
        email: "dabathose@yahoo.com",
        tampons: "8",
        pads: "6",
        need_location: "AZ",
      },
    ];

    beforeEach("insert needs", () => {
      return db.into("needs").insert(testNeeds);
    });
    it("GET /api/needs responds with 200 and all of the needs", () => {
      return supertest(app)
        .get("/api/needs")
        .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
        .expect(200, testNeeds);
    });
    it("GET api/needs/:need_id responds with 200 and the specified need", () => {
      const needId = 2;
      const expectedNeed = testNeeds[needId - 1];
      return supertest(app)
        .get(`/api/needs/${needId}`)
        .set("Authorization", `BEARER ${process.env.API_TOKEN}`)
        .expect(200, expectedNeed);
    });
  });
});
