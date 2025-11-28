const {Sequelize} = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
        timezone: '+00:00',
    }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;