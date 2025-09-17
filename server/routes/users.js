import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import connection from "../connect.js";
import { fileURLToPath } from "url";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();
// 上傳圖片邏輯
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(
      __dirname,
      "../../client/public/images/users/user-photo/"
    );
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 限制
  },
  fileFilter: function (req, file, cb) {
    // 只允許圖片文件
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("只允許上傳圖片文件"));
    }
  },
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// route(s) 路由規則(們)
// routers (路由物件器)

// 獲取所有使用者
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM `users`;";
    // 等同 let users = (await connection.execute(sql))[0]; 只取陣列的第一個元素（實際資料）
    let [users] = await connection.execute(sql);

    res.status(200).json({
      status: "success",
      data: users,
      message: "已 獲取所有使用者",
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 搜尋使用者
router.get("/search", (req, res) => {
  // 查詢參數會被整理到 req 中的 query 裡
  const key = req.query.key;
  res.status(200).json({
    status: "success",
    data: { key },
    message: "搜尋使用者 成功",
  });
});

// 追蹤商品
router.post("/add-wishlist", checkToken, async (req, res) => {
  try {
    const userId = req.decoded.id; // 👈 從 JWT 拿 userId
    const { productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ status: "error", message: "缺少 userId 或 productId" });
    }

    const sql = "INSERT INTO wishlist (users_id, products_id) VALUES (?, ?)";
    const [result] = await connection.execute(sql, [userId, productId]);

    res.json({ status: "success", message: "收藏成功", result });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ 取得追蹤清單
router.get("/wishlist", checkToken, async (req, res) => {
  const userId = req.decoded.id;
  try {
    const [rows] = await connection.execute(
      `
  SELECT 
    p.id, 
    p.name, 
    p.price, 
    (
      SELECT file 
      FROM products_imgs 
      WHERE product_id = p.id 
      LIMIT 1
    ) AS first_image
  FROM wishlist w
  JOIN products p ON w.products_id = p.id
  WHERE w.users_id = ?
  `,
      [userId]
    );

    res.json({ status: "success", data: rows });
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ 移除追蹤
router.delete("/wishlist/:productId", checkToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.decoded.id;

  try {
    const [result] = await connection.execute(
      "DELETE FROM wishlist WHERE users_id=? AND products_id=?",
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該收藏商品" });
    }

    res.json({ status: "success", message: "已移除收藏" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 檢查商品是否已追蹤
router.get("/wishlist-status/:productId", checkToken, async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { productId } = req.params;

    const [rows] = await connection.execute(
      "SELECT * FROM wishlist WHERE users_id = ? AND products_id = ?",
      [userId, productId]
    );

    res.json({
      status: "success",
      isWishlisted: rows.length > 0,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 收藏文章
router.post("/add-favorites", checkToken, async (req, res) => {
  try {
    const userId = req.decoded.id; // 👈 從 JWT 拿 userId
    const { articleId } = req.body;

    if (!userId || !articleId) {
      return res
        .status(400)
        .json({ status: "error", message: "缺少 userId 或 articleId" });
    }

    const sql =
      "INSERT INTO article_favorites (users_id, articles_id) VALUES (?, ?)";
    const [result] = await connection.execute(sql, [userId, articleId]);

    res.json({ status: "success", message: "收藏成功", result });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ 取得收藏清單
router.get("/favorites", checkToken, async (req, res) => {
  const userId = req.decoded.id;
  try {
    const [rows] = await connection.execute(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.cover_image,
        a.created_at,
        c.name AS category_name
      FROM article_favorites f
      JOIN articles a ON f.articles_id = a.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE f.users_id = ?
        AND a.is_deleted = 0
      ORDER BY f.id DESC
      `,
      [userId]
    );

    res.json({ status: "success", data: rows });
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ✅ 移除收藏
router.delete("/favorites/:articleId", checkToken, async (req, res) => {
  const { articleId } = req.params;
  const userId = req.decoded.id;

  try {
    const [result] = await connection.execute(
      "DELETE FROM article_favorites WHERE users_id=? AND articles_id=?",
      [userId, articleId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該收藏文章" });
    }

    res.json({ status: "success", message: "已移除收藏" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 檢查文章是否已收藏
router.get("/favorites-status/:articleId", checkToken, async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { articleId } = req.params;

    const [rows] = await connection.execute(
      "SELECT * FROM article_favorites WHERE users_id = ? AND articles_id = ?",
      [userId, articleId]
    );

    res.json({
      status: "success",
      isWishlisted: rows.length > 0,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 獲取特定 account 使用者
router.get("/:account", async (req, res) => {
  // 路由參數
  try {
    // 動態路徑會被整理到 req 中的 params 裡
    const account = req.params.account;
    // 業務邏輯錯誤需手動拋出
    if (!account) {
      const err = new Error("請提供使用者 ID");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      // [account]代表？
      .execute(sqlCheck1, [account])
      // [result] 直接取得第一個元素
      .then(([result]) => {
        // 取得第一筆資料的物件
        return result[0];
      });

    if (!user) {
      const err = new Error("找不到使用者");
      err.code = 404;
      err.status = "fail";
      throw err;
    }

    // 排除敏感資料不傳給前端
    const { id, password, ...data } = user;

    res.status(200).json({
      status: "success",
      data,
      message: "查詢成功",
    });

    // 只會處理自動拋出的系統錯誤
  } catch (error) {
    // 補獲錯誤
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 新增一個使用者
// 無檔案上傳的 multipart 表單
router.post("/", upload.none(), async (req, res) => {
  try {
    // 取得表單中的欄位內容
    const { account, mail, password } = req.body;

    // 檢查必填
    if (!account || !mail || !password) {
      // 設定 Error 物件
      const err = new Error("請提供完整使用者資訊"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "fail"; // 利用物件的自訂屬性把status字串帶到 catch
      err.message = "請提供完整使用者資訊";
      throw err;
    }

    // 檢查 account 有沒有使用過
    const sqlCheck1 = "SELECT * FROM `users` WHERE `account` = ?;";
    let user = await connection
      .execute(sqlCheck1, [account])
      .then(([result]) => {
        return result[0];
      });
    if (user) {
      const err = new Error("提供的帳號已被使用");
      err.code = 400;
      err.status = "fail";
      err.message = "帳號已被使用";
      throw err;
    }

    // 檢查 mail 有沒有使用過
    const sqlCheck2 = "SELECT * FROM `users` WHERE `mail` = ?;";
    user = await connection
      .execute(sqlCheck2, [mail])
      .then(([result]) => result[0]);

    if (user) {
      if (Number(user.is_valid) === 1) {
        const err = new Error("信箱已被使用");
        err.code = 400;
        err.status = "fail";
        err.message = "信箱已被使用";
        throw err;
      }
      if (Number(user.is_valid) === 0) {
        const err = new Error("已刪除信箱不能再次註冊");
        err.code = 400;
        err.status = "fail";
        err.message = "已刪除信箱不能再次註冊";
        throw err;
      }
    }

    // 從 randomuser.me 取得預設使用者圖片
    const img = "user.jpg";

    // 把密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立 SQL 語法
    const sql =
      "INSERT INTO `users` (account, mail, password, img) VALUES (?, ?, ?, ?);";
    const [result] = await connection.execute(sql, [
      account,
      mail,
      hashedPassword,
      img,
    ]);

    const newUserId = result.insertId;

    // 註冊成功 → 發放固定三張優惠券
    await connection.query(
      `
        INSERT INTO user_coupons (user_id, coupon_id, is_used, created_at, attr)
        SELECT ?, c.id, 0, NOW(), 'force'
        FROM coupon c
        WHERE c.desc IN ('85 折', '滿1000折200', '不限運送方式皆可使用', '滿500折150')
      `,
      [newUserId]
    );

    // 產生 JWT token（一定要帶 id）
    const token = jwt.sign({ id: newUserId, mail, account }, secretKey, {
      expiresIn: "30m",
    });

    res.status(201).json({
      status: "success",
      // 不要回傳敏感資料
      data: {},
      message: "註冊成功",
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "註冊失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 更新(特定 ID 的)使用者
router.put("/:account", upload.single("img"), async (req, res) => {
  try {
    const account = req.params.account;
    if (!account) throw new Error("請提供使用者帳號");

    // 取得要更新的欄位
    let { name, phone, gender_id, year, month, date, city_id, address } =
      req.body;

    // 修正空值型別
    if (city_id === "" || city_id === "null" || city_id === undefined)
      city_id = null;
    if (gender_id === "" || gender_id === "null" || gender_id === undefined)
      gender_id = null;
    if (year === "" || year === "null" || year === undefined) year = null;
    if (month === "" || month === "null" || month === undefined) month = null;
    if (date === "" || date === "null" || date === undefined) date = null;

    // 圖片處理
    let img = null;
    if (req.file) {
      img = req.file.filename; // 這裡現在會有正確的文件名
    }

    // 執行更新
    const sql = `
      UPDATE users SET
        name = ?,
        phone = ?,
        gender_id = ?,
        year = ?,
        month = ?,
        date = ?,
        city_id = ?,
        address = ?${img ? ", img = ?" : ""}
      WHERE account = ?;
    `;
    const params = [
      name,
      phone,
      gender_id,
      year,
      month,
      date,
      city_id,
      address,
    ];
    if (img) params.push(img);
    params.push(account);

    await connection.execute(sql, params);

    // 取得更新後的完整用戶資料
    const sqlGetUser = "SELECT * FROM `users` WHERE `account` = ?;";
    const updatedUser = await connection
      .execute(sqlGetUser, [account])
      .then(([result]) => result[0]);

    if (!updatedUser) {
      throw new Error("無法取得更新後的使用者資料");
    }

    // 排除敏感資料
    const { id, password, ...userData } = updatedUser;

    // 回傳前端期待的格式
    res.status(200).json({
      status: "success",
      data: {
        user: userData,
      },
      message: "更新成功",
    });
  } catch (error) {
    console.error("更新錯誤:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "更新失敗",
    });
  }
});

// 刪除(特定帳號的)使用者
router.delete("/:account", async (req, res) => {
  try {
    const account = req.params.account;
    if (!account) throw new Error("請提供使用者帳號");

    const sql = "UPDATE users SET is_valid = 0 WHERE account = ?;";
    const [result] = await connection.execute(sql, [account]);

    if (result.affectedRows === 0) {
      throw new Error("找不到該帳號，刪除失敗");
    }

    res.status(200).json({
      status: "success",
      message: "帳號已軟刪除 (is_valid=0)",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "刪除失敗",
    });
  }
});

// 使用者登入
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { mail, password } = req.body;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ? AND is_valid=1;";
    let user = await connection.execute(sqlCheck1, [mail]).then(([result]) => {
      return result[0];
    });

    if (!user) {
      const err = new Error("帳號或密碼錯誤1");
      err.code = 400;
      err.status = "error";
      err.message = "使用者不存在";
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("帳號或密碼錯誤2");
      err.code = 400;
      err.status = "error";
      err.message = "密碼錯誤";
      throw err;
    }

    const token = jwt.sign(
      // 加密進 token 的內容
      {
        id: user.id,
        mail: user.mail,
        img: user.img,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
      account: user.account,
      mail: user.mail,
      img: user.img,
    };

    res.status(200).json({
      status: "success",
      message: "登入成功",
      data: { token, user: newUser },
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登入失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 使用者登出
router.post("/logout", checkToken, async (req, res) => {
  try {
    const { mail } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ?;";
    let user = await connection.execute(sqlCheck1, [mail]).then(([result]) => {
      return result[0];
    });
    // 檢查使用者是否存在
    if (!user) {
      const err = new Error("登出失敗");
      err.code = 401;
      err.status = "error";
      throw err;
    }
    // 產生過期 Token
    const token = jwt.sign(
      {
        message: "過期的 token",
      },
      secretKey,
      { expiresIn: "-10s" }
    );
    res.status(200).json({
      status: "success",
      message: "登出成功",
      data: token,
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 400;
    const statusText = error.status ?? "error";
    const message = error.message ?? "登出失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 檢查登入狀態
router.post("/status", checkToken, async (req, res) => {
  try {
    const { mail } = req.decoded;

    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ?;";
    let user = await connection.execute(sqlCheck1, [mail]).then(([result]) => {
      return result[0];
    });
    if (!user) {
      const err = new Error("請登入");
      err.code = 401;
      err.status = "error";
      throw err;
    }

    const token = jwt.sign(
      {
        id: user.id,
        mail: user.mail,
        img: user.img,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
      account: user.account,
      mail: user.mail,
      img: user.img,
    };

    res.status(200).json({
      status: "success",
      message: "處於登入狀態",
      data: { token, user: newUser },
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 401;
    const statusText = error.status ?? "error";
    const message = error.message ?? "身份驗證錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

// 忘記密碼 - 發送驗證碼
router.post("/forgot-password", async (req, res) => {
  try {
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({
        success: false,
        message: "請提供信箱",
      });
    }

    // 檢查用戶是否存在
    const sqlCheck = "SELECT * FROM `users` WHERE `mail` = ? AND is_valid = 1;";
    const user = await connection
      .execute(sqlCheck, [mail])
      .then(([result]) => result[0]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "該信箱用戶不存在",
      });
    }

    // 生成6位數驗證碼
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 設定驗證碼過期時間（10分鐘）
    const codeExpire = new Date(Date.now() + 10 * 60 * 1000);

    // 將驗證碼和過期時間存入資料庫
    const sqlUpdate = `
      UPDATE users 
      SET verification_code = ?, code_expire = ? 
      WHERE mail = ?
    `;
    await connection.execute(sqlUpdate, [verificationCode, codeExpire, mail]);

    try {
      // 發送驗證碼郵件
      await sendEmail({
        email: mail,
        subject: "重設密碼驗證碼",
        message: `您的驗證碼是：${verificationCode}`,
        html: `
          <div
  style="
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 40px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif;
    background-color: #D8E2EC;
  "
>

  <div
    style="
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    "
  >
    <h2
      style="
        color: #2c3e50;
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 30px;
        text-align: center;
      "
    >
      重設密碼驗證碼
    </h2>

    <p
      style="
        color: #555;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      "
    >
      您好，
    </p>

    <p
      style="
        color: #555;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 40px;
      "
    >
      我們收到您重設密碼的請求。請使用以下驗證碼來重設您的密碼：
    </p>

    <div style="text-align: center; margin: 40px 0">
      <div
        style="
          display: inline-block;
          background: #8E7471;
          padding: 3px;
          border-radius: 12px;
        "
      >
        <div
          style="
            background-color: #F8F7F3;
            padding: 20px 40px;
            border-radius: 10px;
          "
        >
          <span
            style="
              font-size: 36px;
              font-weight: bold;
              color: #8E7471;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            "
          >
            ${verificationCode}
          </span>
        </div>
      </div>
    </div>

    <p
      style="
        color: #7f8c8d;
        font-size: 14px;
        text-align: center;
        margin-bottom: 30px;
      "
    >
      此驗證碼將在 <strong>10 分鐘</strong> 後過期。
    </p>

    <p style="color: #7f8c8d; font-size: 14px; line-height: 1.5">
      如果您未申請重設密碼，請忽略此郵件。
    </p>
  </div>

  <div
    style="
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    "
  >
    <p style="color: #95a5a6; font-size: 12px">
      © 2025 ThynC. All rights reserved.
    </p>
  </div>
</div>

        `,
      });

      res.status(200).json({
        success: true,
        message: "驗證碼已發送至您的信箱",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // 如果郵件發送失敗，清除資料庫中的驗證碼
      await connection.execute(
        "UPDATE users SET verification_code = NULL, code_expire = NULL WHERE mail = ?",
        [mail]
      );

      return res.status(500).json({
        success: false,
        message: "驗證碼發送失敗，請稍後再試",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，請稍後再試",
    });
  }
});

// 驗證驗證碼並重設密碼
router.post("/verification-code", upload.none(), async (req, res) => {
  try {
    const { mail, verificationCode, password } = req.body;

    if (!mail || !verificationCode || !password) {
      return res.status(400).json({
        success: false,
        message: "尚有欄位未填寫",
      });
    }

    // 檢查驗證碼和過期時間
    const sqlCheck = `
      SELECT * FROM users 
      WHERE mail = ? AND verification_code = ? AND code_expire > NOW() AND is_valid = 1
    `;
    const user = await connection
      .execute(sqlCheck, [mail, verificationCode])
      .then(([result]) => result[0]);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "驗證碼無效或已過期",
      });
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 更新密碼並清除驗證碼
    const sqlUpdate = `
      UPDATE users 
      SET password = ?, verification_code = NULL, code_expire = NULL 
      WHERE mail = ?
    `;
    await connection.execute(sqlUpdate, [hashedPassword, mail]);

    res.status(200).json({
      success: true,
      message: "密碼重設成功",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "密碼重設失敗，請稍後再試",
    });
  }
});

// Google 登入
router.post("/google-login-simple", async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // 基本驗證
    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "缺少必要的 Google 帳號資訊",
      });
    }

    // 檢查使用者是否已存在（透過 email 或 google_id）
    const sqlCheck =
      "SELECT * FROM users WHERE mail = ? OR google_id = ? AND is_valid = 1";
    const [existingUsers] = await connection.execute(sqlCheck, [
      email,
      googleId,
    ]);

    let user;

    if (existingUsers.length > 0) {
      // 使用者已存在
      console.log("使用者已存在，更新資料");
      user = existingUsers[0];

      // 如果沒有 google_id，就更新它
      if (!user.google_id) {
        await connection.execute(
          "UPDATE users SET google_id = ?, name = COALESCE(name, ?), img = COALESCE(img, ?) WHERE id = ?",
          [googleId, name, picture, user.id]
        );
      }

      // 重新取得更新後的使用者資料
      const [updatedUsers] = await connection.execute(
        "SELECT * FROM users WHERE id = ?",
        [user.id]
      );
      user = updatedUsers[0];
    } else {
      // 建立新使用者
      console.log("建立新使用者");

      const randomAccount = `${Date.now()}`;
      const randomPassword = await bcrypt.hash(
        `google_${googleId}_${Date.now()}`,
        10
      );

      const sqlInsert = `
        INSERT INTO users (account, mail, name, password, img, google_id, is_valid) 
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `;

      const [result] = await connection.execute(sqlInsert, [
        randomAccount,
        email,
        name || email.split("@")[0], // 如果沒有 name 就用 email 前半部
        randomPassword,
        picture,
        googleId,
      ]);

      // 取得新建立的使用者
      const [newUsers] = await connection.execute(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );
      user = newUsers[0];
    }

    // 產生 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        mail: user.mail,
        img: user.img,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    // 準備回傳的使用者資料
    const userData = {
      account: user.account,
      mail: user.mail,
      name: user.name,
      img: user.img,
    };

    res.status(200).json({
      success: true,
      message: "Google 登入成功",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error("Google 登入錯誤:", error);
    res.status(500).json({
      success: false,
      message: "Google 登入失敗：" + error.message,
    });
  }
});

// 變更密碼
router.post("/change-password", checkToken, upload.none(), async (req, res) => {
  try {
    const { mail } = req.decoded; // 從 JWT token 取得使用者信箱
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 後端驗證：檢查必填欄位
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "請填寫所有欄位",
      });
    }

    // 後端驗證：檢查新密碼和確認密碼是否相同
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "新密碼與確認密碼不一致",
      });
    }

    // 後端驗證：檢查新密碼是否與舊密碼相同
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "新密碼不能與舊密碼相同",
      });
    }

    // 取得使用者資料
    const sqlGetUser =
      "SELECT * FROM `users` WHERE `mail` = ? AND is_valid = 1;";
    const user = await connection
      .execute(sqlGetUser, [mail])
      .then(([result]) => result[0]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "使用者不存在",
      });
    }

    // 驗證舊密碼是否正確
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "舊密碼錯誤",
      });
    }

    // 加密新密碼
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密碼
    const sqlUpdatePassword =
      "UPDATE `users` SET `password` = ? WHERE `mail` = ?;";
    const [result] = await connection.execute(sqlUpdatePassword, [
      hashedNewPassword,
      mail,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("密碼更新失敗");
    }

    res.status(200).json({
      success: true,
      message: "密碼變更成功",
    });
  } catch (error) {
    console.error("變更密碼錯誤:", error);
    res.status(500).json({
      success: false,
      message: error.message || "密碼變更失敗，請稍後再試",
    });
  }
});

function checkToken(req, res, next) {
  // 讀取前端送來的 token，從 HTTP Header 取得 Authorization 欄位
  let token = req.get("Authorization");
  console.log("checkToken 收到的 Authorization header:", token);
  if (token && token.includes("Bearer ")) {
    // 純提取 Token 字串，去掉前面的 'Bearer '
    token = token.slice(7);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log("JWT 驗證錯誤:", error);
        res.status(401).json({
          status: "error",
          message: "登入驗證失效，請重新登入",
        });
        return;
      }
      // 將解碼後的 payload(加密的 token 內容) 存入 req 物件，之後路由才知道是誰要登出(執行動作)
      req.decoded = decoded;

      next();
    });
  } else {
    res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
    });
  }
}

// async function getRandomAvatar() {
//   const API = "https://randomuser.me/api";
//   try {
//     const response = await fetch(API);
//     if (!response.ok)
//       throw new Error(`${response.status}: ${response.statusText}`);
//     const result = await response.json();
//     return result.results[0].picture.large;
//   } catch (error) {
//     console.log("getRandomAvatar", error.message);
//     return null;
//   }
// }

export { checkToken };
export default router;
