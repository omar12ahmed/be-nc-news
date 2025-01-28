const db = require("../db/connection");

const selectArticleById = (article_id) => {
  //   console.log(article_id);

  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then(({ rows }) => {
      console.log(rows);

      return rows[0];
    });
};

module.exports = { selectArticleById };
