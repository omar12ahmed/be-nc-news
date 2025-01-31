const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentsByArticleId,
} = require("../models/articles.model");

const getArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);

      next(err);
    });
};

const getCommentsByID = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then(() => {
      return selectCommentsByArticleId(articleId);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err);

      next(err);
    });
};

const postCommentsByID = (req, res, next) => {
  const { body } = req.body;
  const { username } = req.body;
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(() => {
      return addCommentsByArticleId(article_id, body, username);
    })
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = {
  getArticleId,
  getArticles,
  getCommentsByID,
  postCommentsByID,
};
