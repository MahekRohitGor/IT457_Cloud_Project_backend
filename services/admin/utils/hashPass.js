const bcrypt = require("bcrypt");

async function hashPasswords() {
    const passwords = [
        "admin123",
        "manager123",
        "rahul123",
        "neha123",
        "amit123"
    ];

    for (const pass of passwords) {
        const hashed = await bcrypt.hash(pass, 10);
        console.log(pass, "=>", hashed);
    }
}

hashPasswords();