function forgotPasswordTemplate(otp, name = "User") {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:8px;">
          <h2 style="color:#4CAF50; text-align:center;">Password Reset Request</h2>
          <p>Hi <b>${name}</b>,</p>
          <p>You requested to reset your password. Use the below OTP to proceed:</p>

          <div style="text-align:center; padding:15px 0;">
              <span style="
                  font-size:28px;
                  letter-spacing:8px;
                  background:#4CAF50;
                  color:white;
                  padding:10px 20px;
                  border-radius:6px;
                  display:inline-block;
              ">${otp}</span>
          </div>

          <p>This OTP will expire in <b>5 minutes</b>.</p>
          <p>If you didn't request this, please ignore this email.</p>

          <br>
          <p>Regards,<br><b>Auth Service Team</b></p>
      </div>
  </div>
  `;
}

module.exports = { forgotPasswordTemplate };