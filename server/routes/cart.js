import express from "express";
const router = express.Router();

// 模擬購物車資料：以 userId 當 key
const carts = {};

// 取得某個使用者的購物車
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const cart = carts[userId] || [];
  res.json(cart);
});

// 加商品進購物車
router.post("/", (req, res) => {
  const { user_id, product_id, name, image, quantity, price } = req.body;

  if (!carts[user_id]) {
    carts[user_id] = [];
  }

  if (quantity <= 0) {
    return res.status(400).json({ message: "數量必須大於 0" });
  }

  // 看購物車是否已有同商品
  const existingItem = carts[user_id].find(
    (item) => item.product_id === product_id
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[user_id].push({ product_id, name, image, quantity, price });
  }

  res.json({ message: "已加入購物車", cart: carts[user_id] });
});

// 更新購物車項目數量
router.put("/", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "數量必須大於 0" });
  }

  if (!carts[user_id]) {
    return res.status(404).json({ message: "購物車不存在" });
  }

  const pid = Number(product_id);
  const existingItem = carts[user_id].find((item) => item.product_id === pid);

  if (existingItem) {
    existingItem.quantity = quantity; // 直接覆蓋成新數量
    res.json({ message: "已更新數量", cart: carts[user_id] });
  } else {
    res.status(404).json({ message: "商品不存在於購物車" });
  }
});

// 移除購物車項目
router.delete("/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;
  if (!carts[userId]) {
    return res.status(404).json({ message: "購物車不存在" });
  }

  carts[userId] = carts[userId].filter(
    (item) => item.product_id !== parseInt(productId)
  );

  res.json({ message: "已刪除", cart: carts[userId] });
});

// 清空購物車
router.delete("/:userId", (req, res) => {
  const { userId } = req.params;
  carts[userId] = [];
  res.json({ message: "購物車已清空" });
});

export default router;
