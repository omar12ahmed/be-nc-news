const { selectArticleById } = require("../models/articleID.model");

const getArticleId = (req, res) => {
  const articleId = req.params.article_id;
  console.log(req.params);

  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { getArticleId };
