const Address = require("../models/Address");

async function addAddress(req, res, decryptedBody) {
    try {
        const user_id = req.user_id;

        const address = new Address({
            user_id,
            ...decryptedBody
        });

        await address.save();

        return {
            code: 201,
            message: "Address added successfully",
            data: address
        };

    } catch (error) {
        console.log("Add Address Error:", error);
        return { code: 500, message: "Internal Error", data: null };
    }
}

async function listAddresses(req, res) {
    try {
        const addresses = await Address.find({
            user_id: req.user_id,
            is_deleted: false
        });

        return {
            code: 200,
            message: "Addresses fetched",
            data: addresses
        };

    } catch (error) {
        console.log("Address Fetch Error:", error);
        return { code: 500, message: "Internal Error", data: null };
    }
}

module.exports = { addAddress, listAddresses };