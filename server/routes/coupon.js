import express from "express";
import connection from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // ← 新增
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// JWT 驗證中介層
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || req.cookies?.token; // 支援 cookie 或 Bearer

  if (!token) {
    return res.status(401).json({ error: "缺少授權 token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      algorithms: ["HS256"],
    });
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT 驗證失敗:", err);
    return res.status(403).json({ error: "無效或過期的 token" });
  }
}

/* 查詢當前登入者的優惠券（不需要 userId） */
router.get("/available", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await connection.query(
      `SELECT uc.id, c.id AS coupon_id, c.code, c.\`desc\`, c.type, c.value, c.min,
              uc.is_used, uc.used_at, c.expires_at
       FROM user_coupons uc
       JOIN coupon c ON uc.coupon_id = c.id
       WHERE uc.user_id = ?
         AND uc.is_used = 0
         AND c.expires_at > NOW()`,
      [userId]
    );

    console.log("JWT payload:", req.user);
    console.log("查詢 userId:", userId);
    console.log("查詢結果 rows:", rows);

    res.json(rows);
  } catch (err) {
    console.error("查詢優惠券失敗:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
