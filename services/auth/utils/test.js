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

const sample = {
  name: "heli",
  email: "heli@example.com",
  password: "asdfghjkl",
  phone_number: "1234567890"
};

const otp = {
  email: "zxcv@example.com",
  otp: "1872"
};

const reset = {
  reset_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inp4Y3ZAZXhhbXBsZS5jb20iLCJ0eXBlIjoicGFzc3dvcmRfcmVzZXQiLCJpYXQiOjE3NjQyNTA4MDUsImV4cCI6MTc2NDI1MTQwNX0.-p45Qx03jgqmWSbz_m9-3Kb3xjyWy4PG_4xnvtk5bIU",
  new_password: "helloworld"
};

const login = {
  email: "zxcv@example.com"
};

const encrypted = encryptData(reset);
console.log("\n🔒 ENCRYPTED PAYLOAD (copy this to Postman):");
console.log(encrypted);

const decrypted = decryptData("oLJq32RyyKRrhcd+JXkSkX5QPIb+11zd7Z3VJzMuJ3zeRsQh4ayPx7XnOyjWHX9g");
console.log("\n🔓 DECRYPTED:");
console.log(decrypted);

console.log("\n✅ Encryption/Decryption successful:", JSON.stringify(sample) === JSON.stringify(decrypted));