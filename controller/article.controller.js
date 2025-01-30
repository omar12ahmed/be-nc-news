const articles = require("../db/data/test-data/articles");
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
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
      // if (articles.length === 0) {
      //   res.status(200).send([]);
      // }
      res.status(200).send({ articles });

      // console.log(articles);
      // console.log(articles);
    })
    .catch((err) => {
      console.log(err);

      next(err);
    });
};

const getCommentsByID = (req, res, next) => {
  console.log("in the controller");
  const articleId = req.params.article_id;
  console.log(req.params);
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

module.exports = { getArticleId, getArticles, getCommentsByID };
