import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import connection from "../connect.js";

const upload = multer();

const router = express.Router();


// route(s) 路由規則(們)
// routers (路由物件器)
// 獲取所有商品
router.get("/", async (req, res) => {
  try {
    const { mid, cid, brand_id, search, sort, order, page = 1, per_page = 1300 } = req.query;
    let sql = `
  SELECT 
    products.*,
    category_main.name AS category_main_name,
    category_sub.name AS category_sub_name,
    brands.name AS brand_name
  FROM products
  JOIN category_main ON products.category_main_id = category_main.id
  JOIN category_sub ON products.category_sub_id = category_sub.id
  JOIN brands ON products.brand_id = brands.id
  WHERE products.is_valid = 1
`;
    let params = [];

    if (mid) {
      sql += " AND products.category_main_id = ?";
      params.push(mid);
    }
    if (cid) {
      sql += " AND products.category_sub_id = ?";
      params.push(cid);
    }
    if (brand_id) {
      sql += " AND products.brand_id = ?";
      params.push(brand_id);
    }
    if (search) {
      sql += " AND products.name LIKE ?";
      params.push(`%${search}%`);
    }

    // 排序（只允許 price，避免 SQL injection）
    if (sort && ["price"].includes(sort)) {
      sql += ` ORDER BY products.${sort} ${order === "desc" ? "DESC" : "ASC"}`;
    }

    // 分頁
    sql += " LIMIT ? OFFSET ?";
    params.push(Number(per_page));
    params.push((Number(page) - 1) * Number(per_page));

    let [products] = await connection.execute(sql, params);

    res.status(200).json({
      status: "success",
      data: products,
      message: "已 獲取所有商品"
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "商品頁讀取錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message
    });
  }
});

// 商品選項的 API
router.get("/categories", async (req, res) => {
  try {
    // 同時查母分類、子分類、品牌
    const [main] = await connection.execute("SELECT id, name FROM category_main WHERE 1");
    const [sub] = await connection.execute("SELECT id, name,main_id FROM category_sub WHERE 1");
    const [brand] = await connection.execute("SELECT id, name FROM brands WHERE 1");

    res.json({
      status: "success",
      main,
      sub,
      brand
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "DB error" });
  }
});

// 獲取特定 ID 的商品
router.get("/:id", (req, res) => {
  // 路由參數
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: `已 獲取 ${id} 的商品`
  });
});


export default router;