import connection from "../connect.js";
import mysql from "mysql2/promise";
// 產生、加密 token
import crypto from "crypto";

class User {
  constructor(userData) {
    this.id = userData.id;
    this.mail = userData.mail;
    this.password = userData.password;
    this.account = userData.account;
    // 存在資料庫裡的加密 token 用來重設密碼
    this.resetPasswordToken = userData.reset_password_token;
    // token 過期時間
    this.resetPasswordExpire = userData.reset_password_expire;
  }

  // 產生重設密碼 token 的方法
  getResetPasswordToken() {
    // 產生隨機 token，產生 20 個隨機位元組，轉換成 16 進位字串
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      // 建立 SHA256 雜湊物件
      .createHash("sha256")
      // 把剛才的 resetToken 放入要加密的資料
      .update(resetToken)
      // 輸出加密後的結果（16進位格式）
      .digest("hex");

    // 10 分鐘後 token 過期時間
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    // 回傳未加密的 token（放入 email 裡）
    return resetToken;
  }

  // 儲存 reset token 到資料庫
  async save() {
    try {
      await connection.execute(
        "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE id = ?",
        [this.resetPasswordToken, this.resetPasswordExpire, this.id]
      );
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  // 更新密碼並清除 reset token
  async updatePassword(hashedPassword) {
    try {
      await connection.execute(
        "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expire = NULL WHERE id = ?",
        [hashedPassword, this.id]
      );

      // 更新物件屬性
      this.password = hashedPassword;
      this.resetPasswordToken = null;
      this.resetPasswordExpire = null;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
  // (靜態方法)根據 mail 查詢使用者
  static async findByEmail(mail) {
    // 解構賦值，取得查詢結果的第一個元素（資料陣列）
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE mail = ? AND is_valid = 1",
        [mail]
      );

      if (rows.length > 0) {
        // 用查詢到的資料建立新的 User 物件
        return new User(rows[0]);
      }
      return null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }
  // 根據 reset token 查詢使用者（且檢查是否過期）
  static async findByResetToken(resetPasswordToken) {
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expire > ? AND is_valid = 1",
        [resetPasswordToken, new Date()]
      );

      if (rows.length > 0) {
        return new User(rows[0]);
      }
      return null;
    } catch (error) {
      console.error("Error finding user by reset token:", error);
      throw error;
    }
  }
}

export default User;
