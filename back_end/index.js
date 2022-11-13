const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

//variable part
var env = process.env;
var port = env.PORT || 8080;

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: env.ORIGINURL || "*"}));

app.get('/', (req, res) =>{
  res.send("Hello world")
})

//const part
const routerCar = require("./util/router/cars.js");
const routerCustomer = require("./util/router/customer.js");
const routerOrder = require("./util/router/order.js");
const routerInvoice = require("./util/router/invoice.js").router;

app.use("/cars", routerCar);
app.use("/customer", routerCustomer);
app.use("/order", routerOrder);
app.use("/invoice", routerInvoice);

app.listen(port, (err) => {
  if (err) {
    return console.log("error : ", err);
  }
});
