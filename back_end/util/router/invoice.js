const express = require("express");
const router = express.Router();
const db = require("../function/dbConnection.js");
const crypto = require("../function/cryptoHandle.js");
const dateHandle = require("../function/dateHandle.js");

router.get("/download/:Invoice_id", (req, res) => {
  const Invoice_id = crypto.decrypt(req.params.Invoice_id);
  try {
    res.status(200).download(`../invoice/${Invoice_id}.pdf`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:order_id", selectInvoiceInfo, (req, res) => {
  res.status(200).send(req.InvoiceInfo);
});

function selectInvoiceInfo(req, res) {
  // const Order_id = crypto.decrypt(req.params.order_id);
  const Order_id = req.params.order_id;
  const select_query =
    "SELECT Invoice_id, Invoice_totalCharge, Invoice_date FROM InvoiceInfo WHERE Order_id = ?";
  db.query(select_query, [Order_id], (err, result) => {
    if (err) return res.status(500).send(err);
    result[0].Invoice_date = dateHandle.formatDateTime(result[0].Invoice_date);
    result[0].Invoice_id = crypto.encrypt(result[0].Invoice_id);
    req.InvoiceInfo = result;
    next();
  });
}

function insertInvoiceInfo(req, res) {
  const Order_id = crypto.decrypt(req.body.Order_id);
  const { invNum, subtotal } = req.body;
  const insert_query =
    "INSERT INTO InvoiceInfo (Invoice_id, Invoice_date, Order_id, Invoice_totalCharge) VALUES (?, NOW(), ?, ?);";
  db.query(insert_query, [invNum, Order_id, subtotal], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).redirect(req.url || "http://localhost:8080");
  });
}

module.exports = {
  router: router,
  insertInvoiceInfo: insertInvoiceInfo,
};
