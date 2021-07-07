const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const connedtDb = require("./config/db");

const userRouter = require("./routes/userRoutes");

connedtDb();

var bodyParser = require("body-parser");
var encoder = bodyParser.urlencoded();
var jsonParser = bodyParser.json();

app.use(encoder);
app.use(jsonParser);
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("sharad api is running");
});

app.use("/user", userRouter);

app.listen(5000, () => {
  console.log("server is running at 5000 port ");
});
