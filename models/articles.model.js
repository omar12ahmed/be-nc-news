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

const selectArticles = (sort_by = "created_at", order = "DESC") => {
  const validColumns = [
    "title",
    "topic",
    "author",
    "votes",
    "created_at",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
  if (order !== "ASC" && order !== "DESC") {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
  const queryStr = `
  SELECT 
  articles.article_id,
  articles.title,
    articles.topic,
    articles.author,
    articles.votes,
    articles.created_at,
    articles.article_img_url,
    COUNT(comments.comment_id) ::INT AS comment_count from articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr).then(({ rows }) => {
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

const updateArticlesById = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};

const deleteCommentsById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment does not exsistf for ID: ${comment_id}`,
        });
      }

      return rows;
    });
};

module.exports = {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentsByArticleId,
  updateArticlesById,
  deleteCommentsById,
};
