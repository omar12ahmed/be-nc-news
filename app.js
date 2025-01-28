const express = require("express");
const app = express();
const getEndpoints = require("./controller/getEndpoint");
const { getAlltopics } = require("./controller/topics.controller");
const { getArticleId } = require("./controller/articleId.controller");

app.get("/api", getEndpoints);
app.get("/api/topics", getAlltopics);
app.get("/api/articles/:article_id", getArticleId);

//  error handling midleware

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next();
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

module.exports = app;
