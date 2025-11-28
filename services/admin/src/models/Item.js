const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Item = sequelize.define("tbl_items", {
  item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  item_name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  category_id: { type: DataTypes.INTEGER, references: { model: "tbl_category", key: "category_id" }},
  image_link: { type: DataTypes.TEXT },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: "tbl_items"
});

module.exports = Item;