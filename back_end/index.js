const express = require("express");
const mysql = require("mysql");
const app = express();
require('dotenv').config()
var env = process.env;

//variable part
var port = 8080 
var env = process.env;

app.listen(port);

const db = mysql.createPool({
    host: env.HOST, 
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
  });
  