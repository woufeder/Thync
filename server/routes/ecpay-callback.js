import express from "express";
import bodyParser from "body-parser";
import connection from "../connect.js";

const router = express.Router();

// 👇 只在這裡掛 urlencoded，其他路由不受影響
router.post("/", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    const {
      MerchantTradeNo,
      TradeNo,
      RtnCode,
      RtnMsg,
      TradeAmt,
      PaymentDate,
      PaymentType,
    } = req.body;

    console.log("綠界回傳:", req.body);

    const status_now = RtnCode === "1" ? "paid" : "failed";
    const pay_info = `TradeNo:${TradeNo} | Msg:${RtnMsg}`;
    const paid_at = RtnCode === "1" ? PaymentDate.replace(/\//g, "-") : null;

    const sql = `
      UPDATE orders
      SET status_now = ?,
          pay_method = ?,
          pay_info = ?,
          final_amount = ?,
          paid_at = ?
      WHERE numerical_order = ?
    `;

    await pool.execute(sql, [
      status_now,
      PaymentType,
      pay_info,
      TradeAmt,
      paid_at,
      MerchantTradeNo,
    ]);

    // 綠界規範：回應 "1|OK" 才算成功
    res.send("1|OK");
  } catch (err) {
    console.error("回呼處理失敗:", err);
    res.status(500).send("0|Error");
  }
});

export default router;
