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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        p.id,
        p.name AS product_name,
        m.id AS main_id, m.name AS main_name,
        s.id AS sub_id, s.name AS sub_name,
        b.id AS brand_id, b.name AS brand_name
      FROM products p
      JOIN category_main m ON p.category_main_id = m.id
      JOIN category_sub s ON p.category_sub_id = s.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.is_valid = 1
        AND p.id = ?
      LIMIT 1
    `;

    const [rows] = await connection.execute(sql, [id]);

    if (!rows.length) {
      return res.status(404).json({
        status: "error",
        message: "找不到商品"
      });
    }

    res.status(200).json({
      status: "success",
      data: rows[0],
      message: "已獲取單一商品"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "商品細節讀取錯誤"
    });
  }
});


export default router;