const express = require("express");
const db = require("../function/dbConnection");
const router = express.Router();

// router for user to insert, update and delete order
router
  .route("/")
  .post((req, res) => {
    var {
      PickUp_dateTime,
      PickUp_address,
      DropOff_dateTime,
      DropOff_address,
      Cust_id,
      Car_id,
    } = req.body;
    const insert_query =
      "INSERT INTO orderList (Order_dateTime, PickUp_dateTime, PickUp_address, DropOff_dateTime, DropOff_address, Cust_id, Car_id) values ( NOW() , ?, ?, ?, ?, ?, ?)";
    db.query(
      insert_query,
      [
        PickUp_dateTime,
        PickUp_address,
        DropOff_dateTime,
        DropOff_address,
        Cust_id,
        Car_id,
      ],
      (err, result) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  })
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
        if (err) return res.sendStatus(500);
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

// router with orderID and custID as params to select specific info
router.get("/:Order_id/:Cust_id", getOrderInfo, (req, res) => {
  res.status(200).json({
    orderInfo: req.orderInfo,
  });
});

//middleware to select user and order info (included varification)
function getOrderInfo(req, res, next) {
  const Order_id = req.params.Order_id
    ? req.params.Order_id
    : req.body.Order_id;
  const Cust_id = req.params.Cust_id ? req.params.Cust_id : req.body.Cust_id;
  const select_query = "SELECT * FROM OrderList WHERE Order_id = ?";
  db.query(select_query, [Order_id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result[0].Cust_id !== +Cust_id) return res.sendStatus(401);
    req.orderInfo = result;
    next();
  });
}

module.exports = router;
