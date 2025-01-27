const express = require("express");
const app = express();
const getEndpoints = require("./controller/getEndpoint");

app.get("/api", getEndpoints);

module.exports = app;
