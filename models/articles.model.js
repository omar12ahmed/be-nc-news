const db = require("../db/connection");

const selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return rows[0];
    });
};

const selectArticles = () => {
  return db

    .query(
      `SELECT articles.title,
      articles.topic,
      articles.author,
      articles.votes,
      articles.created_at,
      articles.article_img_url,
     COUNT(comments.comment_id) ::INT AS comment_count from articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id =$1`, [article_id])

    .then(({ rows }) => {
      if (rows.length === 0) {
        return [];
      }

      return rows;
    });
};

const addCommentsByArticleId = (article_id, body, username) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES ($1,$2,$3) RETURNING *`,
      [article_id, body, username]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentsByArticleId,
};
