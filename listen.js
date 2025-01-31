const app = require("./app");

const server = app.listen(8080, (err) => {
  if (err) console.error("Server is not running :", err.message);
  console.log("Server is running on port 8080");
});

const { PORT = 9090 } = process.env;
app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
