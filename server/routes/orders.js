
import express from "express";
import connection from "../connect.js";
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY;

const router = express.Router();
// JWT 驗證中介層
function checkToken(req, res, next) {
  let token = req.get("Authorization");
  console.log("[order][checkToken] 收到的 Authorization header:", token);
  if (token && token.includes("Bearer ")) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log("[order][JWT 驗證錯誤]", error);
        res.status(401).json({
          status: "error",
          message: "登入驗證失效，請重新登入",
        });
        return;
      }
      req.decoded = decoded;
      req.userId = decoded.id;
      next();
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
    });
  }
}

router.post("/", checkToken, async (req, res) => {
  try {
    const {
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
        req.userId,
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
