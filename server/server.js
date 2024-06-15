const express = require("express");
require("./mysql_config.js");
const app = express();
var bodyParser = require("body-parser");
const UserRoutes = require("./routes.js");
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(UserRoutes);

//test routes:
app.post("/testpost", async (req, res) => {
  console.log(`REQ BODY:`, req.body);
  res.send();
});

const startServer = async () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();

module.exports = app;
