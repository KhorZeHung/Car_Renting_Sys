const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../function/dbConnection.js");
const validateCustInfo = require("../function/validateCustInfo.js");

router.put(
  "/",
  validateCustInfo.getCustInfo,
  validateCustInfo.userExits,
  (req, res) => {
    const { Cust_email, Cust_pword, Cust_name, Cust_pnum } = req.body;
    bcrypt.hash(Cust_pword, 10, (err, hash) => {
      if (err) {
        res.sendStatus(500);
      } else {
        var update_query = `UPDATE Customer SET Cust_email = ?, Cust_pword = ? , Cust_name = ?, Cust_pnum = ?;`;
        db.query(
          update_query,
          [Cust_email, hash, Cust_name, Cust_pnum],
          (err, result) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }
        );
      }
    });
  }
);

router.post("/new", validateCustInfo.getCustInfo, (req, res) => {
  if (req.mysqlRes.length > 1) {
    res.sendStatus(403);
  } else {
    const { Cust_email, Cust_pword, Cust_name, Cust_pnum } = req.body;
    bcrypt.hash(Cust_pword, 10, (err, hash) => {
      if (err) {
        res.sendStatus(500);
      } else {
        var insert_query = `INSERT INTO Customer (Cust_email, Cust_pword, Cust_name, Cust_pnum) VALUES (?,?,?,?);`;
        db.query(
          insert_query,
          [Cust_email, hash, Cust_name, Cust_pnum],
          (err, result) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          }
        );
      }
    });
  }
});

router.post(
  "/login",
  validateCustInfo.getCustInfo,
  validateCustInfo.userExits,
  (req, res) => {
    const { Cust_pword } = req.body;
    bcrypt.compare(Cust_pword, req.mysqlRes[0].Cust_pword, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else if (!result) {
        res.sendStatus(401);
      } else {
        res.sendStatus(200);
      }
    });
  }
);

module.exports = router;
