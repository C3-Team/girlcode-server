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
    beforeEach(() => {
      return db.into("users").insert(testUsers);
    });

    it(`getAllUsers() resolves all users from 'users' table`, () => {
      return UsersService.getAllUsers(db).then((actual) => {
        expect(actual).to.eql(testUsers);
      });
    });
    it(`getById() resolves a user by id from 'users' table`, () => {
      const thirdId = 3;
      const thirdTestUser = testUsers[thirdId - 1];
      return UsersService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          user_name: thirdTestUser.user_name,
          user_email: thirdTestUser.user_email,
          user_password: thirdTestUser.user_password,
        });
      });
    });

    it(`deleteUser() removes a user by id from 'users' table`, () => {
      const userId = 3;
      return UsersService.deleteUser(db, userId)
        .then(() => UsersService.getAllUsers(db))
        .then((allUsers) => {
          // copy the test articles array without the "deleted" article
          const expected = testUsers.filter((user) => user.id !== userId);
          expect(allUsers).to.eql(expected);
        });
    });

    it(`updateUser() updates a user from the 'users' table`, () => {
      const idOfUserToUpdate = 3;
      const newUserData = {
        user_name: "updated name",
        user_email: "updated email",
        user_password: "new password",
      };
      return UsersService.updateUser(db, idOfUserToUpdate, newUserData)
        .then(() => UsersService.getById(db, idOfUserToUpdate))
        .then((user) => {
          expect(user).to.eql({
            id: idOfUserToUpdate,
            ...newUserData,
          });
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