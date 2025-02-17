const express = require("express");
const app = express();
const getEndpoints = require("./controller/getEndpoint");
const { getAlltopics } = require("./controller/topics.controller");
const {
  getArticleId,
  getArticles,
  getCommentsByID,
  postCommentsByID,
  patchArticlesByVotes,
  removeCommentsById,
} = require("./controller/article.controller");
const { getUsers } = require("./controller/users.controller");
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getAlltopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getCommentsByID);
app.post("/api/articles/:article_id/comments", postCommentsByID);
app.patch("/api/articles/:article_id", patchArticlesByVotes);
app.delete("/api/comments/:comment_id", removeCommentsById);

//  error handling midleware

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Data Type" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required keys" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Username does not exist" });
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
