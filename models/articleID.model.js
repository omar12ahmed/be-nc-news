const db = require("../db/connection");

const selectArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 404,
      msg: "Invalid data type",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])

    .then(({ rows }) => {
      const article = rows[0];

      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

module.exports = { selectArticleById };
