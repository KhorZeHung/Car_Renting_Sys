const db = require("./dbConnection.js");

//function to get customer info
function getCustInfo(req, res, next) {
  var { Cust_email } = req.body;
  var query = `SELECT * FROM Customer WHERE Cust_email = ?`;
  db.query(query, [Cust_email], (err, result) => {
    if (err) return res.send(500);
    req.mysqlRes = result;
    next();
  });
}

//check if user exits in database, return error when user is not exits
function userExits(req, res, next) {
  if (req.mysqlRes.length < 1) return res.sendStatus(401);
  next();
}

module.exports = {
  getCustInfo: getCustInfo,
  userExits: userExits,
};
