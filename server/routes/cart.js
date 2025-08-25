import express from "express";
import db from "../db.js"; // 你要自己寫一個 db.js 用 mysql2 建立連線池
const router = express.Router();

// 取得某個使用者的購物車
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.product_id, p.name, p.image, c.quantity, c.price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 加商品進購物車
router.post("/", async (req, res) => {
  const { user_id, product_id, quantity, price } = req.body;
  try {
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [user_id, product_id, quantity, price]
    );
    res.json({ message: "已加入購物車" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 移除購物車項目
router.delete("/:id", async (req, res) => {
  try {
    await db.query(`DELETE FROM cart WHERE id = ?`, [req.params.id]);
    res.json({ message: "已刪除" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
