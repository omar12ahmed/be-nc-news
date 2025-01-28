const { selectArticleById } = require("../models/articleID.model");

const getArticleId = (req, res, next) => {
  const articleId = req.params.article_id;

  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
      console.log(err);
    });
};

module.exports = { getArticleId };
