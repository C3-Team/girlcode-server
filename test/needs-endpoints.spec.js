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
    context("Given no needs", () => {
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

  describe("POST /api/needs", () => {
    it("creates a need, responding with 201 and the new need", function () {
      this.retries(3);
      const newNeed = {
        user_name: "new user4",
        email: "newtest@yahoo.com",
        tampons: 8,
        pads: 6,
        need_location: "AZ",
      };
      return supertest(app)
        .post("/api/needs")
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .send(newNeed)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_name).to.eql(newNeed.user_name);
          expect(res.body.email).to.eql(newNeed.email);
          expect(res.body.tampons).to.equal(newNeed.tampons);
          expect(res.body.pads).to.eql(newNeed.pads);
          expect(res.body.need_location).to.eql(newNeed.need_location);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/needs/${res.body.id}`);
        });
    });
    const requiredFields = [
      "user_name",
      "email",
      "tampons",
      "pads",
      "need_location",
    ];

    requiredFields.forEach((field) => {
      const newNeed = {
        user_name: "new user",
        email: "newneed@gmail.com",
        tampons: 2,
        pads: 5,
        need_location: "CA",
      };

      it(`responds with 400 and an error message when the '${field}' is missing `, () => {
        delete newNeed[field];

        return supertest(app)
          .post("/api/needs")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .send(newNeed)
          .expect(400, {
            error: { message: `Missing '${field}' in request body ` },
          });
      });
    });
  });
  describe("DELETE /needs/:need_id", () => {
    context("Given no needs", () => {
      it("responds with 404", () => {
        const needId = 123456;
        return supertest(app)
          .delete(`/api/needs/${needId}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: "Need doesn't exist" } });
      });
    });
    context("Given there are needs in the database", () => {
      const testNeeds = makeNeedsArray();

      beforeEach("insert need", () => {
        return db.into("needs").insert(testNeeds);
      });

      it("responds with 204 and removes the need", () => {
        const idToRemove = 2;
        const expectedNeed = testNeeds.filter((need) => need.id !== idToRemove);
        return supertest(app)
          .delete(`/api/needs/${idToRemove}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get("/api/needs")
              .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedNeed)
          );
      });
    });
  });
});
