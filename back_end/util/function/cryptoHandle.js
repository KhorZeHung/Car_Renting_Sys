// crypto module
const crypto = require("crypto");
require("dotenv").config();

const env = process.env;

const algorithm = env.ALG;

// 16 bytes of random data
const initVector = new Buffer.from(env.INITVECTOR, "hex");

// secret key, 32 bytes of random data
const Securitykey = new Buffer.from(env.SECURITYKEY, "hex");

// encrypt the message
// input encoding
// output encoding
function encrypt(message) {
  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  var formatedMessage = isObject(message)
    ? JSON.stringify(message)
    : message.toString();
  try {
    let encryptedData = cipher.update(formatedMessage, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
  } catch (err) {
    console.log(err);
  }
}

function decrypt(message) {
  // the decipher function
  try{
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
    let decryptedData = decipher.update(message, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
  }
  catch(err){
    console.log(err)
  }
}

//check if data is JSON or string
function isObject(data) {
  if (typeof data === "object") return true;
  return false;
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
};
