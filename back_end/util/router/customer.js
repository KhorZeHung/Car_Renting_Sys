const express = require("express");
const bcrypt = require("bcrypt"); // function to hash and compare password
const router = express.Router();
const db = require("../function/dbConnection.js");
const validateCustInfo = require("../function/validateCustInfo.js"); //import function to validate customer
const moment = require("moment");

//function for customer to update self
router.put(
  "/",
  validateCustInfo.getCustInfo,
  validateCustInfo.userExits,
  (req, res) => {
    const { Cust_email, Cust_pword, Cust_name, Cust_pnum } = req.body;
    bcrypt.hash(Cust_pword, 10, (err, hash) => {
      if (err) return res.sendStatus(500);
      var update_query = `UPDATE Customer SET Cust_email = ?, Cust_pword = ? , Cust_name = ?, Cust_pnum = ?;`;
      db.query(
        update_query,
        [Cust_email, hash, Cust_name, Cust_pnum],
        (err, result) => {
          if (err) return res.sendStatus(500);
          res.sendStatus(200);
        }
      );
    });
  }
);

//function for new customer sign up
router.post("/new", validateCustInfo.getCustInfo, (req, res) => {
  if (req.mysqlRes.length > 1) return res.sendStatus(403);
  const { Cust_email, Cust_pword, Cust_name, Cust_pnum } = req.body;
  bcrypt.hash(Cust_pword, 10, (err, hash) => {
    if (err) return res.sendStatus(500);
    var insert_query = `INSERT INTO Customer (Cust_email, Cust_pword, Cust_name, Cust_pnum) VALUES (?,?,?,?);`;
    db.query(
      insert_query,
      [Cust_email, hash, Cust_name, Cust_pnum],
      (err, result) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  });
});

//function for user to login
router.post(
  "/login",
  validateCustInfo.getCustInfo,
  validateCustInfo.userExits,
  (req, res, next) => {
    const { Cust_pword } = req.body;
    bcrypt.compare(Cust_pword, req.mysqlRes[0].Cust_pword, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else if (!result) {
        res.sendStatus(401);
      } else {
        next();
      }
    });
  },
  getCustOrderInfo
);

function getCustOrderInfo(req, res, next) {
  const Cust_id = req.mysqlRes[0].Cust_id;
  const select_query = "SELECT * FROM OrderList WHERE Cust_id = ?";
  db.query(select_query, [Cust_id], (err, result) => {
    if (err) return res.status(500).send(err);
    for (var a = 0; a < result.length; a++) {
      const formatedPickUp = moment(result[a].PickUp_dateTime).format();
      const formatedDropOff = moment(result[a].DropOff_dateTime).format();
      result[a].PickUp_dateTime =
        formatedPickUp.slice(0, 10) + " " + formatedPickUp.slice(11, 19);
      result[a].DropOff_dateTime =
        formatedDropOff.slice(0, 10) + " " + formatedPickUp.slice(11, 19);
    }
    res.status(200).json(result);
  });
}

module.exports = router;
