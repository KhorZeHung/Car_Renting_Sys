const express = require("express");
const router = express.Router();
const db = require("../function/dbConnection.js");

router
  .route("/")
  .get((req, res) => {
    var query = `SELECT * FROM Car`;
    db.query(query, (err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    var { Car_brand, Car_model, Car_rentPrice } = req.body;
    var query = `INSERT INTO Car (Car_brand, Car_model, Car_rentPrice) values (?, ?, ?)`;
    db.query(query, [Car_brand, Car_model, Car_rentPrice], (err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
  })
  .put((req, res) => {
    var { Car_id, Car_brand, Car_model, Car_rentPrice } = req.body;
    var query = `UPDATE Car SET Car_brand = ?, Car_model = ?, Car_rentPrice = ? WHERE Car_id = ?`;
    db.query(
      query,
      [Car_brand, Car_model, Car_rentPrice, Car_id],
      (err, result) => {
        if (err) {
          res.sendStatus(400);
        } else {
          res.sendStatus(200);
        }
      }
    );
  });

router
  .route("/:id")
  .get((req, res) => {
    const carId = req.params.id;
    const query = `SELECT * FROM Car WHERE Car_id = ?`;
    db.query(query, [carId], (err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(result);
      }
    });
  })
  .delete((req, res) => {
    const carId = req.params.id;
    const query = `DELETE FROM Car WHERE Car_id = ?`;
    db.query(query, [carId], (err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(result);
      }
    });
  });

module.exports = router;
