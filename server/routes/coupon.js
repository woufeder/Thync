import express from "express";
import db from "../db.js";
const router = express.Router();

// 查詢全部可用的優惠券
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, code, \`desc\`, type, value, min, start_at, expires_at, is_valid, is_active
       FROM coupon
       WHERE is_active = 1 AND is_valid = 1 AND expires_at > NOW()`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 使用者領取優惠券
router.post("/claim", async (req, res) => {
  const { user_id, coupon_id } = req.body;
  try {
    await db.query(
      `INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)`,
      [user_id, coupon_id]
    );
    res.json({ message: "領取成功" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 查詢使用者已領取的優惠券
router.get("/user/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT uc.id, c.code, c.\`desc\`, c.value, c.min, uc.is_used, uc.used_at
       FROM user_coupons uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
