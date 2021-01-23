const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Users Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("users").truncate());

  context("Given there are users in the database", () => {
    const testUsers = [
      {
        id: 1,
        user_name: "blipbloop",
        user_email: "lkgf;dgk@jdfds.vom",
        user_password: "dsfjfdlgj",
      },
      {
        id: 2,
        user_name: "blipbloop2",
        user_email: "lkgf;dgk2@jdfds.vom",
        user_password: "dsfjf2dlgj",
      },
      {
        id: 3,
        user_name: "blipbloop3",
        user_email: "lkgf;dgk@3jdfds.vom",
        user_password: "dsfjfdl3gj",
      },
      {
        id: 4,
        user_name: "blipbloop4",
        user_email: "lkgf;dgk@4jdfds.vom",
        user_password: "dsfjfdl4gj",
      },
    ];
    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });

    it("GET /users responds with 200 and all of the users", () => {
      return supertest(app).get("/users").expect(200, testUsers);
    });
  });
});
