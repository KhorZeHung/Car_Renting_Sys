const express = require("express");
const mysql = require("mysql");
var fs = require('fs');

const app = express();
require('dotenv').config()

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
  
//  check if dir exits for pic (get and post)

// var checkDirExits = (dir) =>{
//   if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir, { recursive: true });
//     return false;
//   }
//   else{
//     return true
//   } 
// }