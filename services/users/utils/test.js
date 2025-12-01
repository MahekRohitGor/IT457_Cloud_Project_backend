const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const algorithm = "aes-256-cbc";

// Derive key from ENCRYPTION_SECRET
const key = crypto
  .createHash("sha256")
  .update(String(process.env.ENCRYPTION_SECRET))
  .digest("base64")
  .substring(0, 32);

// IV from environment
const iv = Buffer.from(process.env.ENCRYPTION_IV);

function encryptData(data) {
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

const cart = {
  address_id: "692d5db8f5616e01a79d4bb4",   // MongoDB ObjectId of user's address
  payment_method_id: 3                     // 1 = UPI, 2 = Card, 3 = COD
}



const login = {
  email: "admin@cloudkitchen.com",
  password: "admin123"
};

const encrypted = encryptData(cart);
console.log("\n🔒 ENCRYPTED PAYLOAD (copy this to Postman):");
console.log(encrypted);

const decrypted = decryptData("gJH2x1Dnbm+aLSOJIa5iHLbx1c0+nYNsTw+HKXvNPNQFrkqcTXJKT3LaYgZ8ijnE151ycHc9jeV+tCumSZJr6LrzQ7qj0SWp1KKg/RUIL/U=");
console.log("\n🔓 DECRYPTED:");
console.log(decrypted);