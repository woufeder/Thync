import express from "express";
import multer from "multer";
import cors from "cors";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import couponRouter from "./routes/coupon.js";
import articlesRouter from "./routes/articles.js";
import shipmentRouter from "./routes/shipments.js";
import ecpayTestRouter from "./routes/ecpay-test-only.js";

// 設定區
let whitelist = [
  "http://localhost:5500",
  "http://localhost:3000",
  "http://localhost:5173", // React/Vite 開發用
];

let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// 環境設定
const app = express();

// 全域中介軟體
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 路由區
app.get("/", (req, res) => {
  res.send("首頁");
});

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/articles", articlesRouter);
app.use("/shipments", shipmentRouter);
app.use("/ecpay-test", ecpayTestRouter);

app.listen(3007, () => {
  console.log("主機啟動 http://localhost:3007");
});

function checkToken(req, res, next) {
  next();
}
