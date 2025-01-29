const {
  selectArticleById,
  selectArticles,
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
  // const body = req.body;
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

module.exports = { getArticleId, getArticles };
