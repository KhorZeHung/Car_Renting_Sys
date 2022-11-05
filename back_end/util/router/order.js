const express = require("express");
const db = require("../function/dbConnection");
const router = express.Router();
const crypto = require("../function/cryptoHandle.js");
const pdfFactory = require("../function/pdfFactory.js");
const dateHandle = require("../function/dateHandle.js");
const payment = require("../function/paymentStripe.js")

// router for user to insert, update and delete order
router
  .route("/")
  .post(
    (req, res, next) => {
      var {
        PickUp_dateTime,
        PickUp_address,
        PickUp_city,
        PickUp_state,
        DropOff_dateTime,
        DropOff_address,
        DropOff_city,
        DropOff_state,
        Cust_id,
        Car_id,
      } = req.body;
      const OrderDateTime = new Date();
      req.body.Order_dateTime = OrderDateTime;
      Cust_id = crypto.decrypt(req.body.Cust_id);
      const insert_query = `INSERT INTO orderList (Order_dateTime, PickUp_dateTime, PickUp_address, PickUp_city, PickUp_state, DropOff_dateTime, DropOff_address, DropOff_city, DropOff_state, Cust_id, Car_id) values (? , ?, ?, ?, ?, ?, ? ,?, ?, ?, ?);`;
      db.query(
        insert_query,
        [
          OrderDateTime,
          PickUp_dateTime,
          PickUp_address,
          PickUp_city,
          PickUp_state,
          DropOff_dateTime,
          DropOff_address,
          DropOff_city,
          DropOff_state,
          Cust_id,
          Car_id,
        ],
        (err, result) => {
          if (err) return res.status(500).send(err);
          else {
            req.body.Order_id = crypto.encrypt(result.insertId);
            next();
          }
        }
      );
    },
    getInvoiceInfo,
    getInvoiceNum,
    // payment.paymentStripe,
    pdfFactory.createInvoice
  )
  .put(getOrderInfo, (req, res) => {
    const {
      Order_id,
      PickUp_dateTime,
      PickUp_address,
      DropOff_dateTime,
      DropOff_address,
      Car_id,
    } = req.body;
    const update_query =
      "UPDATE OrderList SET PickUp_dateTime = ?, PickUp_address = ?, DropOff_dateTime = ?, DropOff_address = ?, Car_id = ? WHERE Order_id = ?";
    db.query(
      update_query,
      [
        PickUp_dateTime,
        PickUp_address,
        DropOff_dateTime,
        DropOff_address,
        Car_id,
        Order_id,
      ],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
      }
    );
  })
  .delete(getOrderInfo, (req, res) => {
    const { Order_id } = req.body;
    const update_query = "DELETE FROM OrderList WHERE Order_id = ?";
    db.query(update_query, [Order_id], (err, result) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    });
  });
//middleware to select user and order info (included varification)
function getOrderInfo(req, res, next) {
  const Order_id = req.params.Order_id
    ? crypto.decrypt(req.params.Order_id)
    : crypto.decrypt(req.body.Order_id);
  const Cust_id = req.params.Cust_id
    ? crypto.decrypt(req.params.Cust_id)
    : crypto.decrypt(req.body.Cust_id);
  const select_query = "SELECT * FROM orderlist WHERE Order_id = ?;";
  db.query(select_query, [Order_id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result[0].Cust_id !== +Cust_id) return res.sendStatus(401);
    req.orderInfo = result;
    req.body.Order_id = Order_id;
    next();
  });
}

function getInvoiceInfo(req, res, next) {
  const Order_id = crypto.decrypt(req.body.Order_id);
  const select_query = `SELECT o.PickUp_city as PickUp_city, o.PickUp_state as PickUp_state, o.Order_quantity as Order_quantity, cust.Cust_name as Cust_name, o.PickUp_address as PickUp_address, o.Order_id as Order_id, o.Order_dateTime as Order_dateTime, c.Car_brand as Car_brand, c.Car_Model as Car_model, c.Car_rentPrice as Car_rentPrice, c.Car_id as Car_id, o.PickUp_dateTime as PickUp_dateTime, o.DropOff_dateTime as DropOff_dateTime  FROM orderlist as o INNER JOIN car as c ON o.Car_id = c.Car_id INNER JOIN customer as cust ON o.Cust_id = cust.Cust_id WHERE o.Order_id = ?`;
  db.query(select_query, [Order_id], (err, result) => {
    if (err) return res.status(500).send(err);
    req.body.InvInfo = result;
    req.body.bookedDays = dateHandle.getDatesInRange(result[0].PickUp_dateTime, result[0].DropOff_dateTime);
    next();
  });
}

function getInvoiceNum(req, res, next) {
  const select_query =
    "SELECT count(Order_id) as ordNumTdy FROM orderlist WHERE Date(Order_dateTime) = Date(NOW());";
  db.query(select_query, (err, result) => {
    if (err) return res.status(500).send(err);
    req.body.OrderNumToday = result[0].ordNumTdy;
    next();
  });
}

module.exports = router;
