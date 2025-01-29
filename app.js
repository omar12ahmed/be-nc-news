const express = require("express");
const app = express();
const getEndpoints = require("./controller/getEndpoint");
const { getAlltopics } = require("./controller/topics.controller");
const {
  getArticleId,
  getArticles,
} = require("./controller/article.controller");

app.get("/api", getEndpoints);
app.get("/api/topics", getAlltopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles);

//  error handling midleware

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Data Type" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Error" });
});

module.exports = app;
