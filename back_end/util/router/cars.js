const express = require("express");
const mysql = require("mysql");
const router = express.Router();
require("dotenv").config();

//variable part
var env = process.env;

//mysql database connection
const db = mysql.createPool({
  host: env.HOST,
  user: env.USER,
  password: env.PASSWORD,
  database: env.DATABASE,
});

router.get("/", (req, res) => {
  var query = `SELECT * FROM Car`;
  db.query(query, (err, result) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.send(result);
    }
  });
});

router.post("/", (req, res) => {
  var { Car_brand, Car_model, Car_rentPrice} =
    req.body;
  var query = `INSERT INTO Car (Car_brand, Car_model, Car_rentPrice) values (?, ?, ?)`;
  db.query(query, [Car_brand, Car_model, Car_rentPrice], (err, result) => {
    if(err){
        console.log("fail")
        res.sendStatus(400);
    }
    else{
        console.log("success" + result)
        res.sendStatus(200);
    }
  });
});

module.exports = router;
