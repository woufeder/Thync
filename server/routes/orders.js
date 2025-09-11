import express from "express";
import connection from "../connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      delivery_method,
      delivery_address,
      recipient,
      pay_method,
      subtotal,
      discount,
      finalAmount,
      items,
    } = req.body;

    // 建立訂單編號
    const numerical_order = `od${Date.now()}`;

    // 建立訂單
    const [result] = await connection.execute(
      `INSERT INTO orders 
       (numerical_order, user_id, delivery_method, delivery_address, recipient, 
        pay_method, status_now, total, discount_info, final_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numerical_order,
        user_id || 97, // 先硬塞一個 user，等你有會員系統再改
        delivery_method || null,
        delivery_address || null,
        recipient || null,
        pay_method || "ecpay",
        "pending",
        subtotal,
        discount ? JSON.stringify({ discount }) : null,
        finalAmount,
      ]
    );

    const orderId = result.insertId;

    // 建立 order_items
    for (const item of items || []) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.qty, item.price]
      );
    }

    res.json({ status: "success", orderId, numerical_order });
  } catch (err) {
    console.error("建立訂單失敗:", err);
    res.status(500).json({ status: "error", message: "建立訂單失敗" });
  }
});

export default router;
