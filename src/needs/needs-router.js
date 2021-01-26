const path = require("path");
const express = require("express");
const xss = require("xss");
const NeedsService = require("./needs-service");

const needsRouter = express.Router();
const jsonParser = express.json();

const serializeNeed = (need) => ({
  id: need.id,
  user_name: xss(need.user_name),
  email: xss(need.email),
  tampons: xss(need.tampons),
  pads: xss(need.pads),
  zipcode: xss(need.zipcode),
});

needsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NeedsService.getAllNeeds(knexInstance)
      .then((needs) => {
        res.json(needs.map(serializeNeed));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, email, pads, tampons, zipcode } = req.body;
    const newNeed = { user_name, email, pads, tampons, zipcode };

    for (const [key, value] of Object.entries(newNeed)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body `,
          },
        });
      }
    }
    NeedsService.insertNeed(req.app.get("db"), newNeed)
      .then((need) => {
        res.status(201).location(`/needs/${need.id}`).json(need);
      })
      .catch(next);
  });
needsRouter
  .route("/:need_id")
  .all((req, res, next) => {
    NeedsService.getById(req.app.get("db"), req.params.need_id)
      .then((need) => {
        if (!need) {
          return res.status(404).json({
            error: { message: "Need doesn't exist" },
          });
        }
        res.need = need;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNeed(res.need));
  })
  .delete((req, res, next) => {
    NeedsService.deleteNeed(req.app.get("db"), req.params.need_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_name, email, tampons, pads, zipcode } = req.body;
    const needToUpdate = { user_name, email, tampons, pads, zipcode };

    const numberOfValues = Object.values(needToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain  'user_name', 'email', 'pads','tampons','zipcode'",
        },
      });
    NeedsService.updateNeed(req.app.get("db"), req.params.user_id, needToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = needsRouter;
