const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  user_name: xss(user.user_name),
  user_email: xss(user.user_email),
  user_password: xss(user.user_password),
});

usersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    UsersService.getAllUsers(knexInstance)
      .then((users) => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, user_email, user_password } = req.body;
    const newUser = { user_name, user_email, user_password };
    UsersService.insertUser(req.app.get("db"), newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(next);
  });
usersRouter
  .route("/:user_id")
  .all((req, res, next) => {
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get("db"), req.params.user_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_name, user_email, user_password } = req.body;
    const userToUpdate = { user_name, user_email, user_password };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'user_name', 'email', 'password'`,
        },
      });
    UsersService.updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
