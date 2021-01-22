const UsersService = require("../src/users/users-service");
const knex = require("knex");
describe("users service object", function () {
  let db;
  let testUsers = [
    {
      id: 1,
      user_name: "nikoool",
      user_email: "kdjflsdf@yahoo.com",
      user_password: "thisisone",
    },
    {
      id: 2,
      user_name: "pegahdarjk",
      user_email: "dflkfs",
      user_password: "thisisone2",
    },
    {
      id: 3,
      user_name: "thisorthat",
      user_email: "kfjsdlfjlf",
      user_password: "thisisone3",
    },
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });
  before(() => db("users").truncate());
  before(() => {
    return db.into("users").insert(testUsers);
  });
  after(() => db.destroy());
  describe("getAllUsers()", () => {
    it("resolves all users from 'users' table", () => {
      return UsersService.getAllUsers(db).then((actual) => {
        expect(actual).to.eql(testUsers);
      });
    });
  });
});
