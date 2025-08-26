import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt"; // 如果你要存密碼，記得有裝 bcrypt
const router = express.Router();

/* 註冊並強迫發放優惠券 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. 建立使用者
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const userId = result.insertId;

    // 2. 發放固定券 (這裡假設註冊送 couponId = 1)
    await db.query(
      `INSERT INTO user_coupons (user_id, coupon_id, is_used, created_at, attr)
       VALUES (?, 1, 0, NOW(), 'force')`,
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
    const [rows] = await db.query(
      `SELECT uc.id, c.code, c.\`desc\`, c.value, c.min, uc.is_used, uc.used_at, c.expires_at
       FROM user_coupons uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?
         AND uc.is_used = 0
         AND c.expires_at > NOW()`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 歷史紀錄 (history)
  條件：已使用 或 已過期 */

router.get("/user/:userId/history", async (req, res) => {
  try {
    const [rows] = await db.query(
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
  const { code } = req.body;
  try {
    const [rows] = await db.query(
      `SELECT id, code, \`desc\`, value, min, start_at, expires_at
       FROM coupon
       WHERE code = ?
         AND is_active = 1
         AND is_valid = 1
         AND start_at <= NOW()
         AND expires_at > NOW()`,
      [code]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ valid: false, message: "優惠碼無效或已過期" });
    }

    res.json({ valid: true, coupon: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
