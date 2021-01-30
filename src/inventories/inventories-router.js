const path = require("path");
const express = require("express");
const xss = require("xss");
const InventoriesService = require("./inventories-service");
const inventoriesRouter = express.Router();
const jsonParser = express.json();

const serializeInventory = (inventory) => ({
  id: inventory.id,
  user_name: xss(inventory.user_name),
  email: xss(inventory.email),
  tampons: xss(inventory.tampons),
  pads: xss(inventory.pads),
  inventory_location: xss(inventory.inventory_location),
});

inventoriesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    InventoriesService.getAllInventories(knexInstance)
      .then((inventories) => {
        res.json(inventories.map(serializeInventory));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, email, pads, tampons, inventory_location } = req.body;
    const newInventory = {
      user_name,
      email,
      pads,
      tampons,
      inventory_location,
    };

    for (const [key, value] of Object.entries(newInventory)) {
      if (value == null) {
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body `,
          },
        });
      }
    }
    InventoriesService.insertInventory(req.app.get("db"), newInventory)
      .then((inventory) => {
        res
          .status(201)
          .location(`/inventories/${inventory.id}`)
          .json(inventory);
      })
      .catch(next);
  });
inventoriesRouter
  .route("/:inventory_id")
  .all((req, res, next) => {
    InventoriesService.getById(req.app.get("db"), req.params.inventory_id)
      .then((inventory) => {
        if (!inventory) {
          return res.status(404).json({
            error: { message: "Inventory doesn't exist" },
          });
        }
        res.inventory = inventory;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeInventory(res.inventory));
  })
  .delete((req, res, next) => {
    InventoriesService.deleteInventory(
      req.app.get("db"),
      req.params.inventory_id
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { user_name, email, tampons, pads, inventory_location } = req.body;
    const inventoryToUpdate = {
      user_name,
      email,
      tampons,
      pads,
      inventory_location,
    };

    const numberOfValues = Object.values(inventoryToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message:
            "Request body must contain  'user_name', 'email', 'pads','tampons','inventory_location'",
        },
      });
    InventoriesService.updateInventory(
      req.app.get("db"),
      req.params.inventory_id,
      inventoryToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = inventoriesRouter;
