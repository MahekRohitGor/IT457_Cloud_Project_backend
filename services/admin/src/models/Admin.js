const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const bcrypt = require("bcrypt");

const Admin = sequelize.define("tbl_admin", {
  admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  admin_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(20) },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN"), defaultValue: "ADMIN" },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  last_login: { type: DataTypes.DATE },
  is_login: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "tbl_admin",
  timestamps: false
});

Admin.beforeCreate(async (admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

Admin.beforeUpdate(async (admin) => {
  if (admin.changed("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

module.exports = Admin;
