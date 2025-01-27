const endpointsJson = require("../endpoints.json");

function getEndoints(req, res) {
  res.status(200).send({ endpoints: endpointsJson });
}

module.exports = getEndoints;
