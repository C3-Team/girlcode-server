/* eslint-disable no-console */
/* eslint-disable quotes */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./errorHandler");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validateBearerToken");

const app = express();
const inventoriesRouter = require("./inventories/inventories-router");
const needsRouter = require("./needs/needs-router");
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken);
app.use("/api/inventories", inventoriesRouter);
app.use("/api/needs", needsRouter);
app.get("/", (req, res) => {
  res.send("Hello, world!!!");
});

app.use(errorHandler);
module.exports = app;
