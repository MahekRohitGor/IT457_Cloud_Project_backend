const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");

async function placeOrder(req, res, decryptedBody) {
    try {
        const user_id = req.user_id;
        const { address_id, payment_method_id } = decryptedBody;

        const cart = await Cart.findOne({ user_id });
        if (!cart || cart.items.length === 0) {
            return { code: 400, message: "Cart is empty", data: null };
        }

        const address = await Address.findById(address_id);
        if (!address) {
            return { code: 404, message: "Address not found", data: null };
        }

        const sub_total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const tax_percentage = 5;
        const tax_amount = (sub_total * tax_percentage) / 100;
        const delivery_fee = 30;
        const total_amount = sub_total + tax_amount + delivery_fee;

        const order = new Order({
            order_number: `ORD-${Date.now()}`,
            user_id,
            items: cart.items.map(i => ({
                item_id: i.item_id,
                item_name: i.item_name,
                item_price: i.price,
                qty: i.qty,
                total_price: i.price * i.qty
            })),
            address,
            sub_total,
            tax_percentage,
            tax_amount,
            delivery_fee,
            total_amount,
            payment_method_id,
            payment_status: "cod_pending",
            order_status: "confirmed",
            delivery_status: "pending"
        });

        await order.save();

        cart.items = [];
        await cart.save();

        const cleanOrder = {
            order_id: order._id,
            order_number: order.order_number,
            user_id: order.user_id,
            address: {
                street_address: order.address.street_address,
                city: order.address.city,
                state: order.address.state,
                zip_code: order.address.zip_code,
                phone: order.address.phone
            },
            items: order.items.map(i => ({
                item_id: i.item_id,
                item_name: i.item_name,
                item_price: i.item_price,
                qty: i.qty,
                total_price: i.total_price
            })),
            sub_total: order.sub_total,
            tax_percentage: order.tax_percentage,
            tax_amount: order.tax_amount,
            delivery_fee: order.delivery_fee,
            total_amount: order.total_amount,
            payment_method_id: order.payment_method_id,
            payment_status: order.payment_status,
            order_status: order.order_status,
            delivery_status: order.delivery_status,
            created_at: order.createdAt,
            updated_at: order.updatedAt
        };

        return {
            code: 201,
            message: "Order placed successfully",
            data: cleanOrder
        };

    } catch (error) {
        console.log("Place Order Error:", error);
        return { code: 500, message: "Internal Server Error", data: null };
    }
}

module.exports = { placeOrder };