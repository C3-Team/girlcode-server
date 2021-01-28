/* eslint-disable quotes */
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DB_URL || "postgresql://nikadarab@localhost/girlcode",
  API_TOKEN: process.env.API_TOKEN || "9bde2e85-c6e2-4118-aaa5-e4a8b186a881",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://nikadarab@localhost/girlcode-test",
};
