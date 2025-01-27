const selectAlltopics = require("../models/topics.model");

const getAlltopics = (req, res) => {
  selectAlltopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { getAlltopics };
