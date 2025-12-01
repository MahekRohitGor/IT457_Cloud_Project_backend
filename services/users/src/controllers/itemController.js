const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const {decryptData} = require('../../utils/cryptoUtils');

async function listItems(req, res, decryptedBody) {
    console.log("Inside Item Controller - List Items");
    try {
        const response = await axios.get(
            `${process.env.ADMIN_MS_URL}/list-item`,
            { headers: { "x-api-key": process.env.API_KEY } }
        );

        return {
            code: 200,
            message: "Items fetched successfully - users",
            data: decryptData(response.data.payload).data
        };

    } catch (error) {
        console.log("Item Fetch Error:", error);
        return { code: 500, message: "Internal Error", data: null };
    }
}

module.exports = { listItems };