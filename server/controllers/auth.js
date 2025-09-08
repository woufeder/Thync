import User from "../models/users.js";
// 導入 sendEmail 工具函式
import sendEmail from "../utils/sendEmail.js";
// 產生密碼雜湊
import bcrypt from "bcrypt";
// 產生隨機值
import crypto from "crypto";
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.mail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "There is no user with that email",
      });
    }

    // 產生重設密碼 Token
    const resetToken = user.getResetPasswordToken();
    // 儲存到資料庫
    await user.save();
    // 建立重設密碼的 URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
    // 建立要寄給使用者的訊息
    const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to: ${resetUrl}`;

    try {
      // 發送 email
      await sendEmail({
        email: user.mail,
        subject: 'Password reset token',
        message: `重設密碼連結: ${resetUrl}`
      });

      res.status(200).json({
        success: true,
        data: 'Email sent'
      });
    } catch (err) {
      console.error('Email sending error:', err);
      
      // 如果 email 發送失敗，清除 token 讓使用者重新請求
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // 從 URL 參數取得 token 並加密（比對資料庫中的格式）
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    // 尋找符合 token 且未過期的使用者
    const user = await User.findByResetToken(resetPasswordToken);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token or token has expired'
      });
    }

    // 檢查新密碼
    if (!req.body.password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password'
      });
    }

    // 更新使用者密碼
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // 重設密碼並清除 reset token
    await user.updatePassword(hashedPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};