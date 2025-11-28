const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Category = sequelize.define("tbl_category", {
  category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_name: { type: DataTypes.STRING(100), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: false,
  tableName: "tbl_category"
});

module.exports = Category;