import express from "express";
import crypto from "crypto";
const router = express.Router();

// 產生 CheckMacValue(跑綠界7-11地圖的必要參數) 的工具函式
function genCheckMacValue(params, hashKey, hashIV) {
  const sorted = Object.keys(params)
    .sort((a, b) => a.localeCompare(b, "en"))
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const raw = `HashKey=${hashKey}&${sorted}&HashIV=${hashIV}`;

  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%21/g, "!")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2a/g, "*");

  return crypto.createHash("md5").update(encoded).digest("hex").toUpperCase();
}


// 測試用產生完整參數 API
router.get("/cvs/genMac", (req, res) => {
  const params = {
    MerchantID: "3002607",
    MerchantTradeNo: "test" + Date.now(),
    LogisticsType: "CVS",
    LogisticsSubType: "UNIMART",
    IsCollection: "N",
    ServerReplyURL: "http://localhost:3007/api/cart/cvs/callback",
  };

  params.CheckMacValue = genCheckMacValue(
    params,
    "pwFHCqoQZGmho4w6",      // 你的 HashKey
    "EkRm7iFT261dpevs"       // 你的 HashIV
  );

  res.json(params);
});

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

  const existingItem = carts[uid].find((item) => item.product_id === pid);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    carts[uid].push({
      product_id: pid,
      name,
      image,
      quantity: qty,
      price: prc,
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

  const existingItem = carts[uid].find((item) => item.product_id === pid);

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

  carts[uid] = carts[uid].filter((item) => item.product_id !== pid);

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

router.get("/:userId/checkout", (req, res) => {
  const uid = toUid(req.params.userId);
  const cart = carts[uid] || [];

  if (cart.length === 0) {
    return res.status(400).json({ message: "購物車是空的" });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.json({
    user_id: uid,
    total,
    final_amount: total, // 預設與 total 一樣，優惠券折扣後才會改
    coupons_id: null,
    discount_info: null,
    cart_items: cart,
  });
});

// 暫存最新選店資訊
let latestStore = null;

router.post("/cvs/callback", (req, res) => {
  const { CVSStoreID, CVSStoreName, CVSAddress } = req.body;
  latestStore = { CVSStoreID, CVSStoreName, CVSAddress };
  console.log("選店回傳：", latestStore);
  res.send("OK");
});

router.get("/cvs/store", (req, res) => {
  res.json(latestStore);
});

export default router;
