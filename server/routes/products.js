import express from "express";
import multer from "multer";

const upload = multer();

const router = express.Router();


// route(s) 路由規則(們)
// routers (路由物件器)
// 獲取所有商品
router.get("/", (req, res)=>{
  res.status(200).json({
    status: "success",
    data: [],
    message: "已獲取所有商品"
  });
});

// 搜尋商品
router.get("/search", (req, res)=>{
  // 網址參數(查詢參數)會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: {key},
    message: "搜尋商品 成功"
  });
});

// 獲取特定 ID 的商品
router.get("/:id", (req, res)=>{
  // 路由參數
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: {id},
    message: `已 獲取 ${id} 的商品`
  });
});

// 新增一個商品
router.post("/", (req, res)=>{
  res.status(201).json({
    status: "success",
    data: {},
    message: "新增一個商品 成功"
  });
});

// 更新(特定 ID 的)商品
router.put("/:id", (req, res)=>{
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: {id},
    message: "更新(特定 ID 的)商品 成功"
  });
});

// 刪除(特定 ID 的)商品
router.delete("/:id", (req, res)=>{
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: {id},
    message: "刪除(特定 ID 的)商品 成功"
  });
});


// 檢查登入狀態
router.post("/status", checkToken, (req, res)=>{
  res.status(200).json({
    status: "success",
    data: "token",
    message: "檢查登入狀態 成功"
  });
});

function checkToken(req, res, next){
  next();
}

export default router;