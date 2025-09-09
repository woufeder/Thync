import express from "express";
import connection from "../connect.js";
import bcrypt from "bcrypt"; // 如果你要存密碼，記得有裝 bcrypt
const router = express.Router();

/* 註冊並強迫發放優惠券 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. 建立使用者
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const userId = result.insertId;

    // 2. 發放固定券 (滿額折扣、新戶專屬、免運優惠各1)
    await connection.query(
      `INSERT INTO user_coupons (user_id, coupon_id, is_used, created_at, attr)
   SELECT ?, c.id, 0, NOW(), 'force'
   FROM coupon c
   WHERE c.code IN ('C001', 'C002', 'C003')`,
      [userId]
    );

    res.status(201).json({
      message: "註冊成功，並已發放優惠券",
      userId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 可使用的優惠券 (available)
  條件：還沒使用、未過期 */

router.get("/user/:userId/available", async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT uc.id, c.id AS coupon_id, c.code, c.\`desc\`, c.type, c.value, c.min,
              uc.is_used, uc.used_at, c.expires_at
       FROM user_coupons uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?
         AND uc.is_used = 0
         AND c.expires_at > NOW()`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("查詢優惠券失敗:", err);
    res.status(500).json({ error: err.message });
  }
});

/* 歷史紀錄 (history)
  條件：已使用 或 已過期 */

router.get("/user/:userId/history", async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT uc.id, c.code, c.\`desc\`, c.value, c.min, uc.is_used, uc.used_at, c.expires_at
       FROM user_coupons uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?
         AND (uc.is_used = 1 OR c.expires_at <= NOW())`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 驗證優惠碼 (validate)
 用於結帳時輸入 code 驗證 */

router.post("/validate", async (req, res) => {
  const { user_id, code, total } = req.body;
  try {
    // 找優惠券
    const [rows] = await connection.query(
      `SELECT id, code, \`desc\`, type, value, min, start_at, expires_at
       FROM coupon
       WHERE code = ?
         AND is_active = 1
         AND is_valid = 1
         AND start_at <= NOW()
         AND expires_at > NOW()`,
      [code]
    );
    if (!rows.length) {
      return res.json({ valid: false, message: "優惠碼無效或已過期" });
    }
    const coupon = rows[0];

    // 檢查是否發給過該 user
    const [uc] = await connection.query(
      `SELECT * FROM user_coupons
       WHERE user_id = ? AND coupon_id = ? AND is_used = 0`,
      [user_id, coupon.id]
    );
    if (!uc.length) {
      return res.json({ valid: false, message: "此優惠券未發放或已使用" });
    }

    // 檢查金額門檻
    if (total < coupon.min) {
      return res.json({
        valid: false,
        message: `需滿 ${coupon.min} 元才可使用`,
      });
    }

    // 計算折扣
    let discount = 0;
    if (coupon.type === "amount") {
      discount = coupon.value;
    } else if (coupon.type === "percent") {
      discount = Math.floor(total * (coupon.value / 100));
    } else if (coupon.type === "free_shipping") {
      discount = 60; // 免運直接折抵運費，依規則調整
    }

    res.json({
      valid: true,
      discount,
      coupon,
      message: "折扣碼可使用",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
