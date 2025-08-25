import express from "express";
const router = express.Router();

// GET /api/cart → 取得購物車
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "商品A", price: 500, qty: 1 },
    { id: 2, name: "商品B", price: 800, qty: 2 },
  ]);
});

// POST /api/cart → 加入商品
router.post("/", (req, res) => {
  const { name, price, qty } = req.body;
  res.json({ message: "已加入購物車", item: { name, price, qty } });
});

// DELETE /api/cart/:id → 移除商品
router.delete("/:id", (req, res) => {
  res.json({ message: `商品 ${req.params.id} 已刪除` });
});

export default router;
