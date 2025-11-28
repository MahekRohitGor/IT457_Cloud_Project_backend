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

const create = {
  category_name: "Beverages"
}

const up1 = {
  category_id: 3,
  category_name: "Cold Beverages"
}

const up2 = {
  category_id: 3,
  is_active: false
}

const up3 = {
  category_id: 3,
  category_name: "Desserts & Ice Cream",
  is_active: true
}

const del = {
  "category_id": 5
}

const add = {
  item_name: "Cheese Pizza",
  description: "Loaded with cheese",
  price: 199,
  category_id: 1
}

const upp1 = {
  item_id: 5,
  item_name: "Spicy Cheese Pizza",
  category_id: 1,
  price: 229
}

const upp2 = {
  item_id: 5,
  is_available: false
}

const del1 = {
  item_id: 5
}

const login = {
  email: "admin@cloudkitchen.com",
  password: "admin123"
};

const encrypted = encryptData(del1);
console.log("\n🔒 ENCRYPTED PAYLOAD (copy this to Postman):");
console.log(encrypted);

const decrypted = decryptData("gJH2x1Dnbm+aLSOJIa5iHEqeGKXLHHIk5CBvurDE+Bbzi/vo1uBpttCPchRFuE0UTgTeOPsoBGd8tvuZx2uyKA==");
console.log("\n🔓 DECRYPTED:");
console.log(decrypted);