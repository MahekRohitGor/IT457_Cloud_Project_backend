const Admin = require("../models/Admin");
const Item = require("../models/Item");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
require("../models/associations");

async function loginAdmin(req, res, decryptedBody) {
    try {
        console.log("Decrypted Body:", decryptedBody);
        const { email, password } = decryptedBody;
        if (!email || !password) {
            return {
                code: 400,
                message: "Email and password are required",
                data: null
            };
        } else {
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return {
                    code: 404,
                    message: "Admin not found",
                    data: null
                }
            } else {
                if (!admin.is_active) {
                    return {
                        code: 403,
                        message: "Admin account is disabled",
                        data: null
                    };
                }
                if (admin.is_deleted) {
                    return {
                        code: 403,
                        message: "Admin account is deleted",
                        data: null
                    };
                }

                const isPasswordValid = await bcrypt.compare(password, admin.password);
                if (!isPasswordValid) {
                    return {
                        code: 401,
                        message: "Invalid Password",
                        data: null
                    };
                } else {
                    const token = jwt.sign({
                        admin_id: admin.admin_id,
                        role: admin.role
                    },
                        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

                    admin.is_login = true;
                    admin.last_login = new Date();
                    await admin.save();

                    return {
                        code: 200,
                        message: "Login Successful",
                        data: token
                    };
                }
            }
        }
    } catch (error) {
        console.log("Admin Login Error: ", error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function logoutAdmin(req, res, decryptedBody) {
    try {
        const admin_id = req.headers["x-admin-id"];

        if (!admin_id) {
            return {
                code: 400,
                message: "Admin ID missing in headers",
                data: null
            }
        }

        else {
            const admin = await Admin.findByPk(admin_id);
            if (!admin) {
                return {
                    code: 404,
                    message: "Admin not found",
                    data: null
                }
            }
            else {
                if (admin.is_deleted) {
                    return {
                        code: 403,
                        message: "Admin account is deleted",
                        data: null
                    };
                }

                if (!admin.is_active) {
                    return {
                        code: 403,
                        message: "Admin account is disabled",
                        data: null
                    };
                }

                if (!admin.is_login) {
                    return {
                        code: 200,
                        message: "Admin already logged out",
                        data: null
                    };
                }

                admin.is_login = false;
                await admin.save();

                return {
                    code: 200,
                    message: "Logout Successful",
                    data: null
                }
            }
        }

    } catch (error) {
        console.log("Admin Logout Error: ", error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function add_category(req, res, decryptedBody) {
    try {
        const { category_name } = decryptedBody;
        if (!category_name || !category_name.trim()) {
            return {
                code: 400,
                message: "Category name is required",
                data: null
            };
        } else {
            const existing = await Category.findOne({
                where: { category_name, is_deleted: false }
            });

            if (existing) {
                return {
                    code: 409,
                    message: "Category already exists",
                    data: null
                };
            } else {
                const newCategory = await Category.create({
                    category_name
                });

                return {
                    code: 201,
                    message: "Category added successfully",
                    data: newCategory
                };
            }
        }

    } catch (error) {
        console.log("Add Category Error: ", error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function getCategories(req, res) {
    try {
        const categories = await Category.findAll({
            where: { is_deleted: false },
            include: [
                {
                    model: Item,
                    attributes: ["item_id", "item_name", "price", "is_available"],
                }
            ],
            order: [["created_at", "DESC"]]
        });

        return {
            code: 200,
            message: "Categories fetched successfully",
            data: categories
        };

    } catch (error) {
        console.error("Get Categories Error:", error);
        return { code: 500, message: "Internal Server Error", data: null };
    }
}

async function deleteCategory(req, res, decryptedBody) {
    try {
        const { category_id } = decryptedBody;

        if (!category_id) {
            return { code: 400, message: "Category ID is required", data: null };
        }

        const category = await Category.findByPk(category_id);

        if (!category || category.is_deleted) {
            return { code: 404, message: "Category not found", data: null };
        }

        const itemCount = await Item.count({
            where: { category_id }
        });

        if (itemCount > 0) {
            return {
                code: 400,
                message: "Cannot delete category with existing items",
                data: null
            };
        }

        category.is_deleted = true;
        await category.save();

        return {
            code: 200,
            message: "Category deleted successfully",
            data: null
        };

    } catch (error) {
        console.error("Delete Category Error:", error);
        return { code: 500, message: "Internal Server Error", data: null };
    }
}

async function updateCategory(req, res, decryptedBody) {
    try {
        const { category_id, category_name, is_active } = decryptedBody;

        if (!category_id) {
            return { 
                code: 400, 
                message: "Category ID is required", 
                data: null 
            };
        }

        const category = await Category.findByPk(category_id);

        if (!category || category.is_deleted) {
            return { 
                code: 404, 
                message: "Category not found", 
                data: null 
            };
        }

        if (category_name) {
            const duplicate = await Category.findOne({
                where: {
                    category_name,
                    is_deleted: false
                }
            });

            if (duplicate && duplicate.category_id !== category_id) {
                return {
                    code: 409,
                    message: "Another category with this name already exists",
                    data: null
                };
            }
        }

        if (category_name) category.category_name = category_name;
        if (typeof is_active === "boolean") category.is_active = is_active;

        await category.save();

        return {
            code: 200,
            message: "Category updated successfully",
            data: category
        };

    } catch (error) {
        console.error("Update Category Error:", error);
        return { 
            code: 500, 
            message: "Internal Server Error", 
            data: null 
        };
    }
}

module.exports = {
    loginAdmin,
    logoutAdmin,
    add_category,
    getCategories,
    deleteCategory,
    updateCategory
}