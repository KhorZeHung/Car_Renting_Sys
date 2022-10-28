const db = require("./dbConnection.js");

function getCustInfo(req, res, next) {
  var { Cust_email } = req.body;
  var query = `SELECT * FROM Customer WHERE Cust_email = ?`;
  db.query(query, [Cust_email], (err, result) => {
    if (err) {
      res.send(500);
    } else {
      req.mysqlRes = result;
      next();
    }
  });
}

function userExits(req, res, next) {
  if (req.mysqlRes.length < 1) {
    res.sendStatus(401);
  } else {
    next();
  }
}

module.exports = {
  getCustInfo: getCustInfo,
  userExits: userExits,
};
