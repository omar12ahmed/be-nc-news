const express = require("express");
const app = express();
const getEndpoints = require("./controller/getEndpoint");
const { getAlltopics } = require("./controller/topics.controller");

app.get("/api", getEndpoints);
app.get("/api/topics", getAlltopics);

module.exports = app;
