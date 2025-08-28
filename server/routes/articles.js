import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import connection from "../connect.js";

const upload = multer();
const router = express.Router();


// route(s) 路由規則(們)
// routers (路由物件器)
// 獲取所有文章
router.get("/", async (req, res) => {
  try {
    const { cid, tag_id, search, sort, order, page = 1, per_page = 6 } = req.query;
    let sql = `
    SELECT DISTINCT
      a.*,
      c.name AS category_name,
      GROUP_CONCAT(DISTINCT t.name ORDER BY t.name ASC SEPARATOR ', ') AS tags,
      GROUP_CONCAT(DISTINCT t.id ORDER BY t.name ASC SEPARATOR ',') AS tag_ids
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    WHERE 1=1
    `;
    let params = [];
    
    // 只篩選未刪除的文章（如果 is_deleted 欄位存在）
    sql += " AND (a.is_deleted = 0 OR a.is_deleted IS NULL)";

    // 支援多個分類ID（用逗號分隔）
    if (cid) {
      const categoryIds = cid.split(',').map(id => id.trim()).filter(id => id);
      if (categoryIds.length > 0) {
        sql += ` AND a.category_id IN (${categoryIds.map(() => '?').join(',')})`;
        params.push(...categoryIds);
      }
    }
    
    // 支援多個標籤ID（用逗號分隔）
    if (tag_id) {
      const tagIds = tag_id.split(',').map(id => id.trim()).filter(id => id);
      if (tagIds.length > 0) {
        sql += ` AND EXISTS (
          SELECT 1 FROM article_tags at2 
          WHERE at2.article_id = a.id 
          AND at2.tag_id IN (${tagIds.map(() => '?').join(',')})
        )`;
        params.push(...tagIds);
      }
    }
    if (search) {
      sql += " AND (a.title LIKE ? OR a.content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // GROUP BY
    sql += " GROUP BY a.id, c.id, c.name";

    // 排序（只允許特定欄位，避免 SQL injection）
    if (sort && ["created_at", "updated_at", "views", "title"].includes(sort)) {
      sql += ` ORDER BY a.${sort} ${order === "desc" ? "DESC" : "ASC"}`;
    } else {
      sql += " ORDER BY a.created_at DESC";
    }

    // 分頁
    sql += " LIMIT ? OFFSET ?";
    params.push(Number(per_page));
    params.push((Number(page) - 1) * Number(per_page));

    let [articles] = await connection.execute(sql, params);

    // 獲取總筆數（用於分頁）
    let countSql = `
    SELECT COUNT(DISTINCT a.id) as total
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    WHERE 1=1
    `;
    let countParams = [];
    
    // 同樣的篩選條件
    countSql += " AND (a.is_deleted = 0 OR a.is_deleted IS NULL)";
    
    // 支援多個分類ID（用逗號分隔）
    if (cid) {
      const categoryIds = cid.split(',').map(id => id.trim()).filter(id => id);
      if (categoryIds.length > 0) {
        countSql += ` AND a.category_id IN (${categoryIds.map(() => '?').join(',')})`;
        countParams.push(...categoryIds);
      }
    }
    
    // 支援多個標籤ID（用逗號分隔）
    if (tag_id) {
      const tagIds = tag_id.split(',').map(id => id.trim()).filter(id => id);
      if (tagIds.length > 0) {
        countSql += ` AND EXISTS (
          SELECT 1 FROM article_tags at2 
          WHERE at2.article_id = a.id 
          AND at2.tag_id IN (${tagIds.map(() => '?').join(',')})
        )`;
        countParams.push(...tagIds);
      }
    }
    if (search) {
      countSql += " AND (a.title LIKE ? OR a.content LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    let [countResult] = await connection.execute(countSql, countParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / Number(per_page));

    res.status(200).json({
      status: "success",
      data: {
        articles,
        pagination: {
          current_page: Number(page),
          per_page: Number(per_page),
          total: total,
          total_pages: totalPages,
          has_prev: Number(page) > 1,
          has_next: Number(page) < totalPages
        }
      },
      message: "已獲取所有文章"
    });
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "文章頁讀取錯誤，請洽管理人員"
    });
  }
});

// 除錯用 API - 查看資料庫中的所有文章（不含篩選）
router.get("/debug", async (req, res) => {
  try {
    // 查看文章總數
    const [countResult] = await connection.execute("SELECT COUNT(*) as total FROM articles");
    
    // 查看前 5 筆文章資料
    const [articles] = await connection.execute("SELECT id, title, category_id, is_deleted FROM articles LIMIT 5");
    
    // 查看分類資料
    const [categories] = await connection.execute("SELECT * FROM categories LIMIT 5");
    
    // 查看標籤資料
    const [tags] = await connection.execute("SELECT * FROM tags LIMIT 5");
    
    // 查看文章標籤關聯
    const [articleTags] = await connection.execute("SELECT * FROM article_tags LIMIT 5");

    res.json({
      status: "success",
      debug_info: {
        total_articles: countResult[0].total,
        sample_articles: articles,
        sample_categories: categories,
        sample_tags: tags,
        sample_article_tags: articleTags
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: "error", 
      message: "Debug error",
      error: err.message 
    });
  }
});

// 文章選項的 API
router.get("/categories", async (req, res) => {
  try {
    // 同時查分類、標籤
    const [categories] = await connection.execute("SELECT id, name FROM categories WHERE 1");
    const [tags] = await connection.execute("SELECT id, name FROM tags WHERE 1");

    res.json({
      status: "success",
      categories,
      tags
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "DB error" });
  }
});

// 獲取特定 ID 的文章
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let sql = `
    SELECT 
      a.*,
      c.name AS category_name
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.id = ? AND a.is_deleted = 0
    `;
    let [articles] = await connection.execute(sql, [id]);
    
    if (articles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "文章不存在"
      });
    }

    // 更新瀏覽次數
    await connection.execute("UPDATE articles SET views = views + 1 WHERE id = ?", [id]);

    // 獲取文章標籤
    let tagsResult = await connection.execute(`
      SELECT t.id, t.name
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = ?
    `, [id]);
    
    // 獲取文章圖片
    let imagesResult = await connection.execute(`
      SELECT id, image_url, description
      FROM article_images
      WHERE article_id = ?
    `, [id]);

    const article = {
      ...articles[0],
      tags: tagsResult[0],
      images: imagesResult[0]
    };

    res.status(200).json({
      status: "success",
      data: article,
      message: `已獲取文章：${article.title}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "獲取文章時發生錯誤，請洽管理人員"
    });
  }
});




export default router;