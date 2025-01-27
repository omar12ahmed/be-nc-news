const db = require("../db/connection");

const selectAlltopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};

module.exports = selectAlltopics;
