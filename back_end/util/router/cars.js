const express = require("express");
const router = express.Router();
const db = require("../function/dbConnection.js");
const moment = require("moment");
const dateHandle = require("../function/dateHandle.js");

//all function for CRUD car info
router
  .route("/")
  .get((req, res) => {
    var select_query = `SELECT * FROM Car`;
    db.query(select_query, (err, result) => {
      if (err) return res.sendStatus(500);
      res.send(result);
    });
  })
  .post((req, res) => {
    var { Car_brand, Car_model, Car_rentPrice } = req.body;
    var insert_query = `INSERT INTO Car (Car_brand, Car_model, Car_rentPrice) values (?, ?, ?)`;
    db.query(
      insert_query,
      [Car_brand, Car_model, Car_rentPrice],
      (err, result) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  })
  .put((req, res) => {
    var { Car_id, Car_brand, Car_model, Car_rentPrice } = req.body;
    var update_query = `UPDATE Car SET Car_brand = ?, Car_model = ?, Car_rentPrice = ? WHERE Car_id = ?`;
    db.query(
      update_query,
      [Car_brand, Car_model, Car_rentPrice, Car_id],
      (err, result) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  });

// function of Read and Delete for car info (with pk)
// return json with two key value (carInfo, orderList)
// \orderList is an object with two key value pair (PickUp_Date, DropOff_Date)
// each key's value is an array that
router
  .route("/:id")
  .get((req, res) => {
    const carId = req.params.id;
    const select_query2 = `SELECT * FROM Car WHERE Car_id = ?`;
    db.query(select_query2, [carId], (err, carInfo) => {
      if (err) return res.sendStatus(500);
      const select_query3 = `SELECT cast(o.PickUp_dateTime as Date) as PickUp_dateTime, cast(o.DropOff_dateTime as Date) as DropOff_dateTime FROM car as c INNER JOIN orderlist as o ON c.Car_id = o.Car_id WHERE PickUp_dateTime >= NOW();`;
      db.query(select_query3, (err, orderList) => {
        if (err) return res.sendStatus(500);
        var bookedDate = [];
        for (var a = 0; a < orderList.length; a++) {
          const pickup = moment(orderList[a].PickUp_dateTime)
            .format()
            .slice(0, 10);
          const dropoff = moment(orderList[a].DropOff_dateTime)
            .format()
            .slice(0, 10);
          bookedDate.push(dateHandle.getDatesInRange(pickup, dropoff));
        }
        res.json({
          carInfo: carInfo,
          orderList: bookedDate,
        });
      });
    });
  })
  .delete((req, res) => {
    const carId = req.params.id;
    const delete_query = `DELETE FROM Car WHERE Car_id = ?`;
    db.query(delete_query, [carId], (err, result) => {
      if (err) return res.sendStatus(400);
      res.send(result);
    });
  });

module.exports = router;
