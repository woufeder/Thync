import express from "express";
const router = express.Router();

// 模擬購物車資料：以 userId 當 key
const carts = {};

// 小工具函式
function toUid(id) {
  return String(id); // user_id 一律轉字串，避免物件 key 不一致
}

function toPid(id) {
  return Number(id); // product_id 一律轉數字
}

function toNumber(value, defaultValue = 0) {
  const n = Number(value);
  return isNaN(n) ? defaultValue : n;
}

// 取得某個使用者的購物車
router.get("/:userId", (req, res) => {
  const uid = toUid(req.params.userId);
  const cart = carts[uid] || [];
  res.json(cart);
});

// 加商品進購物車
router.post("/", (req, res) => {
  const { user_id, product_id, name, image, quantity, price } = req.body;

  const uid = toUid(user_id);
  const pid = toPid(product_id);
  const qty = toNumber(quantity, 1);
  const prc = toNumber(price);

  if (qty <= 0) {
    return res.status(400).json({ message: "數量必須大於 0" });
  }

  if (!carts[uid]) {
    carts[uid] = [];
  }

  const existingItem = carts[uid].find(item => item.product_id === pid);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    carts[uid].push({
      product_id: pid,
      name,
      image,
      quantity: qty,
      price: prc
    });
  }

  res.json({ message: "已加入購物車", cart: carts[uid] });
});

// 更新購物車項目數量
router.put("/", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const uid = toUid(user_id);
  const pid = toPid(product_id);
  const qty = toNumber(quantity);

  if (qty <= 0) {
    return res.status(400).json({ message: "數量必須大於 0" });
  }

  if (!carts[uid]) {
    return res.status(404).json({ message: "購物車不存在" });
  }

  const existingItem = carts[uid].find(item => item.product_id === pid);

  if (existingItem) {
    existingItem.quantity = qty;
    res.json({ message: "已更新數量", cart: carts[uid] });
  } else {
    res.status(404).json({ message: "商品不存在於購物車" });
  }
});

// 移除購物車項目
router.delete("/:userId/:productId", (req, res) => {
  const uid = toUid(req.params.userId);
  const pid = toPid(req.params.productId);

  if (!carts[uid]) {
    return res.status(404).json({ message: "購物車不存在" });
  }

  carts[uid] = carts[uid].filter(item => item.product_id !== pid);

  res.json({ message: "已刪除", cart: carts[uid] });
});

// 清空購物車
router.delete("/:userId", (req, res) => {
  const uid = toUid(req.params.userId);

  if (!carts[uid]) {
    return res.status(404).json({ message: "購物車不存在" });
  }

  carts[uid] = [];
  res.json({ message: "購物車已清空" });
});

export default router;
