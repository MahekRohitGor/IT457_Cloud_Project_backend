const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const key = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_SECRET)).digest('base64').substring(0, 32);
const iv = Buffer.from(process.env.ENCRYPTION_IV);

function encryptData(data){
    const json = JSON.stringify(data);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(json, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function decryptData(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

module.exports = {
  encryptData,
  decryptData,
};