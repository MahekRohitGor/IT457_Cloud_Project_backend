const Item = require("./Item");
const Category = require("./Category");

Category.hasMany(Item, { 
  foreignKey: "category_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

Item.belongsTo(Category, { 
  foreignKey: "category_id"
});

module.exports = {
  Item,
  Category,
};