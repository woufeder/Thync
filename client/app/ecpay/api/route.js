import * as crypto from "crypto";
import { NextResponse } from "next/server";

// GET：產生送往綠界的訂單參數
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const amount = Number(searchParams.get("amount")) || 0;
  const items = searchParams.get("items") || "";

  if (!amount) {
    return NextResponse.json({ status: "error", message: "缺少總金額" });
  }

  const itemName =
    items.split(",").length > 1
      ? items.split(",").join("#")
      : "線上商店購買一批";

  // 綠界固定參數
  const MerchantID = "3002607";
  const HashKey = "pwFHCqoQZGmho4w6";
  const HashIV = "EkRm7iFT261dpevs";
  const isStage = true;

  const TotalAmount = amount;
  const TradeDesc = "商店線上付款";
  const ItemName = itemName;

  const ReturnURL = "https://www.ecpay.com.tw";
  const OrderResultURL = "http://localhost:3000/ecpay/api"; // 綠界付款完成回呼
  const ChoosePayment = "ALL";

  const stage = isStage ? "-stage" : "";
  const APIURL = `https://payment${stage}.ecpay.com.tw/Cashier/AioCheckOut/V5`;

  const MerchantTradeNo = `od${Date.now()}`;
  const MerchantTradeDate = new Date().toLocaleString("zh-TW", {
    hour12: false,
  });

  let ParamsBeforeCMV = {
    MerchantID,
    MerchantTradeNo,
    MerchantTradeDate,
    PaymentType: "aio",
    EncryptType: 1,
    TotalAmount,
    TradeDesc,
    ItemName,
    ReturnURL,
    ChoosePayment,
    OrderResultURL,
  };

  function CheckMacValueGen(parameters, algorithm = "sha256", digest = "hex") {
    const Step1 = Object.entries(parameters)
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join("&");
    const Step2 = `HashKey=${HashKey}&${Step1}&HashIV=${HashIV}`;
    const Step3 = encodeURIComponent(Step2).toLowerCase();
    const Step4 = crypto.createHash(algorithm).update(Step3).digest(digest);
    return Step4.toUpperCase();
  }

  const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV);

  const AllParams = { ...ParamsBeforeCMV, CheckMacValue };

  return NextResponse.json({ status: "success", data: { action: APIURL, params: AllParams } });
}

// POST：綠界付款完成回呼
export async function POST(req) {
  const formData = await req.formData();
  const entries = {};
  for (const [key, value] of formData.entries()) {
    entries[key] = value;
  }

  console.log("綠界回傳參數:", entries);

  // 組 query string
  const params = new URLSearchParams(entries).toString();

  // 用 req.url 取 base，再拼接完整網址
  const base = new URL(req.url);               // e.g. http://localhost:3000/ecpay/api
  base.pathname = "/ecpay/callback";           // 換掉 path
  base.search = params ? `?${params}` : "";    // 加上 query string

  return NextResponse.redirect(base.toString());
}