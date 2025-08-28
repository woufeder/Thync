import express from "express";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import connection from "../connect.js";

const upload = multer();
const secretKey = process.env.JWT_SECRET_KEY;
const router = express.Router();

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

// 獲取特定 ID 使用者
router.get("/:id", async (req, res) => {
  // 路由參數
  try {
    // 動態路徑會被整理到 req 中的 params 裡
    const mail = req.params.id;
    // 業務邏輯錯誤需手動拋出
    if (!mail) {
      const err = new Error("請提供使用者 ID");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ?;";
    let user = await connection
      // [mail]代表？
      .execute(sqlCheck1, [mail])
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
    const { name, mail, password } = req.body;

    // 檢查必填
    if (!name || !mail || !password) {
      // 設定 Error 物件
      const err = new Error("請提供完整使用者資訊"); // Error 物件只能在小括號中自訂錯誤訊息
      err.code = 400; // 利用物件的自訂屬性把 HTTP 狀態碼帶到 catch
      err.status = "fail"; // 利用物件的自訂屬性把status字串帶到 catch
      err.message = "請提供完整使用者資訊";
      throw err;
    }

    // 檢查 mail 有沒有使用過
    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ?;";
    let user = await connection.execute(sqlCheck1, [mail]).then(([result]) => {
      return result[0];
    });
    if (user) {
      const err = new Error("提供的註冊內容已被使用1");
      err.code = 400;
      err.status = "fail";
      err.message = "信箱已被使用";
      throw err;
    }

    // 從 randomuser.me 取得預設使用者圖片
    const img = await getRandomAvatar();

    // 把密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立 SQL 語法
    const sql =
      "INSERT INTO `users` (name, mail, password, img) VALUES (?, ?, ?, ?);";
    await connection.execute(sql, [name, mail, hashedPassword, img]);

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
router.put("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "更新(特定 ID 的)使用者 成功",
  });
});

// 刪除(特定 ID 的)使用者
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    data: { id },
    message: "刪除(特定 ID 的)使用者 成功",
  });
});

// 使用者登入
router.post("/login", upload.none(), async (req, res) => {
  try {
    const { mail, password } = req.body;
    console.log(mail);

    const sqlCheck1 = "SELECT * FROM `users` WHERE `mail` = ?;";
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
        mail: user.mail,
        img: user.img,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
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
        mail: user.mail,
        img: user.img,
      },
      secretKey,
      { expiresIn: "30m" }
    );

    const newUser = {
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

function checkToken(req, res, next) {
  // 讀取前端送來的 token，從 HTTP Header 取得 Authorization 欄位
  let token = req.get("Authorization");
  console.log(token);
  if (token && token.includes("Bearer ")) {
    // 純提取 Token 字串，去掉前面的 'Bearer '
    token = token.slice(7);
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log(error);
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

async function getRandomAvatar() {
  const API = "https://randomuser.me/api";
  try {
    const response = await fetch(API);
    if (!response.ok)
      throw new Error(`${response.status}: ${response.statusText}`);
    const result = await response.json();
    return result.results[0].picture.large;
  } catch (error) {
    console.log("getRandomAvatar", error.message);
    return null;
  }
}

export default router;
