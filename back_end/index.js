const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//variable part
var env = process.env;
var port = env.PORT || 8080;

//const part
const routerCar = require("./util/router/cars.js")

app.use("/cars", routerCar);

app.listen(port, (err) => {
  if (err) {
    return console.log("error : ", err);
  }
});
