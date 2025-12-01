const Cart = require("../models/Cart");
const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const {decryptData} = require('../../utils/cryptoUtils');

async function addToCart(req, res, decryptedBody) {
    try {
        const user_id = req.user_id;
        const { item_id, qty } = decryptedBody;

        const itemRes = await axios.get(
            `${process.env.ADMIN_MS_URL}/list-item/${item_id}`,
            { headers: { "x-api-key": process.env.API_KEY } }
        );

        const adminData = decryptData(itemRes.data.payload);
        const item = adminData.data;

        let cart = await Cart.findOne({ user_id });

        if (!cart) cart = new Cart({ user_id, items: [] });

        const existingItem = cart.items.find(i => i.item_id === item_id);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.items.push({
                item_id: item.item_id,
                item_name: item.item_name,
                price: Number(item.price),
                qty
            });
        }

        await cart.save();

        return {
            code: 200,
            message: "Item added to cart",
            data: cart.items
        };

    } catch (error) {
        console.log("Add to cart error:", error);
        return { 
            code: 500, 
            message: "Internal Error", 
            data: null 
        };
    }
}

async function getCart(req, res, decryptedBody) {
    try {
        const cart = await Cart.findOne({ user_id: req.user_id });
        return {
            code: 200,
            message: "Cart fetched successfully",
            data: cart ? cart.items : []
        };
    } catch (error) {
        console.log("Cart Fetch Error:", error);
        return { 
            code: 500, 
            message: "Internal Error", 
            data: null 
        };
    }
}

module.exports = { addToCart, getCart };