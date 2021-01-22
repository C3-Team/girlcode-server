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
  afterEach(() => db("users").truncate());
  after(() => db.destroy());

  context(`Given 'users' has data`, () => {
    before(() => {
      return db.into("users").insert(testUsers);
    });

    it(`getAllUsers() resolves all articles from 'users' table`, () => {
      return UsersService.getAllUsers(db).then((actual) => {
        expect(actual).to.eql(testUsers);
      });
    });
  });
  context(`Given 'users' has no data`, () => {
    it(`getAllUsers() resolves an empty array`, () => {
      return UsersService.getAllUsers(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertArticle() inserts a new article and resolves the new user with an 'id'`, () => {
      const newUser = {
        user_name: "new user",
        user_email: "new email",
        user_password: "new pass",
      };
      return UsersService.insertUser(db, newUser);
    });
  });
});
