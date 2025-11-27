const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { checkEmailFormat } = require("../../common/check");
const {forgotPasswordTemplate} = require("../../utils/emailTemplate");
const {sendEmail} = require("../../utils/emailService");

async function signup(req, res, decryptedBody) {
    try {
        const { name, email, password, phone_number } = decryptedBody;
        if (!name || !email || !password || !phone_number) {
            return {
                code: 400,
                message: "Name, email, phone number, and password fields are required",
                data: null
            }
        } else {
            if (!await checkEmailFormat(email)) {
                return {
                    code: 400,
                    message: "Invalid email format",
                    data: null
                }
            } else {
                const existingUser = await User.findOne({
                    where: { email_id: email }
                });

                if (!existingUser) {
                    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
                    const newUser = new User({
                        user_name: name,
                        email_id: email,
                        password,
                        phone_number: phone_number,
                        otp: otpCode,
                        profile_pic: null,
                        last_login: null
                    });

                    await newUser.save();
                    return {
                        code: 201,
                        message: "User registered successfully",
                        data: {
                            userId: newUser.user_id,
                            email: newUser.email_id
                        }
                    }

                } else {
                    return {
                        code: 409,
                        message: "User with this email already exists",
                        data: null
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function login(req, res, decryptedBody) {
    try {
        const { email, password } = decryptedBody;
        if (!email || !password) {
            return {
                code: 400,
                message: "Email and password are required",
                data: null
            }
        } else {
            const user = await User.findOne({
                where: { email_id: email }
            });

            if (!user) {
                return {
                    code: 404,
                    message: "User not found",
                    data: null
                }
            } else {
                if (!user.is_verified) {
                    return {
                        code: 400,
                        message: "User email not verified",
                        data: null
                    }
                } else {
                    const validPassword = await bcrypt.compare(password, user.password);
                    if (!validPassword) {
                        return {
                            code: 401,
                            message: "Invalid credentials",
                            data: null
                        };
                    } else {
                        user.is_login = true;
                        user.last_login = new Date();
                        await user.save();

                        const token = jwt.sign(
                            { user_id: user.user_id, email: user.email_id },
                            process.env.JWT_SECRET,
                            { expiresIn: process.env.JWT_EXPIRES_IN }
                        );

                        return {
                            code: 200,
                            message: "Login successful",
                            data: token
                        };
                    }
                }
            }
        }

    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function verifyOtp(req, res, decryptedBody) {
    try {
        const { email_id, otp } = decryptedBody;

        if (!email_id || !otp) {
            return {
                code: 400,
                message: "Email ID and OTP are required",
                data: null
            }
        } else {
            const user = await User.findOne({
                where: { email_id: email_id }
            });

            if (!user) {
                return {
                    code: 404,
                    message: "User not found",
                    data: null
                }
            } else {
                if (user.otp === otp) {
                    user.is_verified = true;
                    user.otp = null;
                    await user.save();
                    return {
                        code: 200,
                        message: "OTP verified successfully",
                        data: { user_id: user.user_id },
                    };
                } else {
                    return {
                        code: 401,
                        message: "Invalid OTP",
                        data: null,
                    };
                }
            }
        }
        } catch (error) {
            console.log(error);
            return {
                code: 500,
                message: "Internal Server Error",
                data: null
            }
        }
}

async function logout(req, res, decryptedBody){
    try{
        const user_id = req.headers["x-user-id"];
        if(!user_id){
            return {
                code: 400,
                message: "User ID not found in request",
                data: null
            }
        } else{
            const user = await User.findOne({
                where: { user_id: user_id }
            });
            if(!user){
                return {
                    code: 404,
                    message: "User not found",
                    data: null
                }
            } else{
                user.is_login = false;
                await user.save();
                return {
                    code: 200,
                    message: "Logout successful",
                    data: null
                }
            }
        }

    } catch(error){
        console.log(error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function forgotPassword(req, res, decryptedBody){
    try{
        const {email} = decryptedBody;
        if(!email){
            return {
                code: 400,
                message: "Email ID not found in request",
                data: null
            }
        } else{
            if(!await checkEmailFormat(email)){
                return {
                    code: 400,
                    message: "Invalid email format",
                    data: null
                }
            } else{
                const user = await User.findOne({
                    where: { email_id: email }
                });

                if(!user){
                    return {
                        code: 404,
                        message: "User not found",
                        data: null
                    }
                } else{
                    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
                    const expiry = new Date(Date.now() + 5 * 60 * 1000);

                    user.otp = otpCode;
                    user.otp_expiry = expiry;

                    await user.save();

                    const html = forgotPasswordTemplate(otpCode, user.user_name);
                    await sendEmail(email, "Password Reset OTP", html);

                    return {
                        code: 200,
                        message: "OTP sent to email",
                        data: null
                    }
                }
            }
        }

    } catch(error){
        console.log(error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

async function verifyResetOtp(req, res, decryptedBody){
    try{
        const {email, otp} = decryptedBody;
        if(!email || !otp){
            return {
                code: 400,
                message: "Email and OTP are required",
                data: null
            }
        } else{
            const user = await User.findOne({
                where: { email_id: email }
            });
            if(!user){
                return {
                    code: 404,
                    message: "User not found",
                    data: null
                }
            } else{
                if(user.otp != otp){
                    return{
                        code: 401,
                        message: "Invalid OTP",
                        data: null
                    }
                } else if(user.otp_expiry < new Date()){
                    return{
                        code: 401,
                        message: "OTP has expired",
                        data: null
                    }
                } else{
                    user.otp = null;
                    user.otp_expiry = null;
                    await user.save();
                    return {
                        code: 200,
                        message: "OTP verified successfully",
                        data: { user_id: user.user_id }
                    }
                }
            }
    }
    } catch(error){
        console.log(error);
        return {
            code: 500,
            message: "Internal Server Error",
            data: null
        }
    }
}

module.exports = {
    signup,
    login,
    verifyOtp,
    logout,
    forgotPassword,
    verifyResetOtp
}