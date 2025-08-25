import express from "express";
const router = express.Router();
import connection from "../connect.js";

// 取得某個使用者的購物車
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await connection.query(
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
    await connection.query(
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
    await connection.query(`DELETE FROM cart WHERE id = ?`, [req.params.id]);
    res.json({ message: "已刪除" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
