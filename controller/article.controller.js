const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentsByArticleId,
  updateArticlesById,
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
      next(err);
    });
};

const patchArticlesByVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(() => {
      return updateArticlesById(inc_votes, article_id);
    })
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleId,
  getArticles,
  getCommentsByID,
  postCommentsByID,
  patchArticlesByVotes,
};
