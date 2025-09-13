"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "./confirm.css";


// 這是原本串綠界測試 API 的程式碼
// async function handleSubmitOrder() {
//   try {
//     // 1. 從 localStorage 拿表單與購物車資料
//     const form = JSON.parse(localStorage.getItem("checkoutForm")) || {};
//     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
//     const discount = Number(localStorage.getItem("discount") || 0);

//     // 2. 計算金額
//     const subtotal = cartItems.reduce(
//       (sum, item) => sum + (item.price || 0) * (item.qty || 1),
//       0
//     );
//     const shipping = form.shippingType === "宅配到府" ? 80 : 60;
//     const total = subtotal + shipping;
//     const finalAmount = total - discount;

//     // 3. 呼叫後端 ecpay 測試 API
//     const res = await fetch(
//       `http://localhost:3007/ecpay-test?amount=${finalAmount}&items=${cartItems
//         .map((i) => i.title)
//         .join(",")}`
//     );
//     const result = await res.json();

//     // 注意這裡要用 result.data
//     const { action, params } = result.data;

//     const formEl = document.createElement("form");
//     formEl.method = "POST";
//     formEl.action = action;

//     Object.entries(params).forEach(([key, value]) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = value;
//       formEl.appendChild(input);
//     });

//     document.body.appendChild(formEl);
//     formEl.submit();
//   } catch (err) {
//     console.error(err);
//     alert("付款流程失敗，請稍後再試");
//   }
// }

async function handleSubmitOrder() {
  try {
    // 1. 取資料
    const form = JSON.parse(localStorage.getItem("checkoutForm")) || {};
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const discount = Number(localStorage.getItem("discount") || 0);

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    const shipping = form.shippingType === "宅配到府" ? 80 : 60;
    const total = subtotal + shipping;
    const finalAmount = total - discount;

    // 2. 建立訂單
  // 取得 JWT token，key 要和 use-auth.js 一致
  const token = localStorage.getItem("reactLoginToken");
    const resOrder = await fetch("http://localhost:3007/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        delivery_method: form.shippingType,
        delivery_address: form.storeAddress,
        recipient: form.receiverName,
        pay_method: "ecpay",
        subtotal,
        discount,
        finalAmount,
        items: cartItems.map((i) => ({
          id: i.id,
          qty: i.qty,
          price: i.price,
        })),
      }),
    });

    const orderResult = await resOrder.json();
    if (orderResult.status !== "success") {
      alert("建立訂單失敗: " + (orderResult.message || "未知錯誤"));
      return;
    }

    const { numerical_order } = orderResult;

    // 3. 呼叫 ecpay-test
    const res = await fetch(
      `http://localhost:3007/ecpay-test?orderNo=${numerical_order}&amount=${finalAmount}&items=${cartItems
        .map((i) => i.product_name)
        .join(",")}`
    );
    const result = await res.json();
    const { action, params } = result.data;

    // 4. 自動建立表單送出
    const formEl = document.createElement("form");
    formEl.method = "POST";
    formEl.action = action;
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      formEl.appendChild(input);
    });
    document.body.appendChild(formEl);
    formEl.submit();
  } catch (err) {
    console.error(err);
    alert("付款流程失敗，請稍後再試");
  }
}



// 推薦商品假資料（與 cartPage.js 統一格式）
const recommend = Array(6).fill({
  img: "https://picsum.photos/id/1058/600/400",
  title: "A4tech 雙飛燕 Bloody S98",
  price: "$2390",
});

function getCheckoutForm() {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("checkoutForm");
    if (data) return JSON.parse(data);
  }
  return {};
}
export default function Page() {
  const [form, setForm] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    setForm(getCheckoutForm());
    const cartData = localStorage.getItem("cartItems");
    if (cartData) setCartItems(JSON.parse(cartData));
    // 折扣可根據 localStorage 或其他資料取得
    const discountData = localStorage.getItem("discount");
    setDiscount(discountData ? Number(discountData) : 0);
  }, []);

  // 動態計算金額
  const count = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );
  const shipping = form.shippingType === "宅配到府" ? 80 : 60;
  const total = subtotal + shipping - discount;

  return (
    <>
        <Header />
      <main>
        <CartHeader />
        <CartSteps active={2} />
        <div className="container">
          {/* 收件與運送摘要 */}
          <section className="checkout">
            <div className="panel">
              <h3 className="panel-title">寄送與付款</h3>
              <div className="panel-body">
                <div className="row">
                  <label className="radio">7-11 取貨付款</label>
                  <label className="radio">收貨人：{form.receiverName}</label>
                  <label className="radio">
                    手機號碼：{form.receiverPhone}
                  </label>
                </div>
                <div className="row">
                  <label className="radio">運送方式：{form.shippingType}</label>
                  <label className="radio">門市名稱：{form.storeName}</label>
                </div>
                <div className="row">
                  <label className="radio">門市地址：{form.storeAddress}</label>
                </div>
              </div>
            </div>

            {/* 購買人資訊摘要 */}
            <div className="panel">
              <h3 className="panel-title">購買人資訊</h3>
              <div className="panel-body">
                <div className="row">
                  <label className="radio">姓名：{form.receiverName}</label>
                  <label className="radio">
                    手機號碼：{form.receiverPhone}
                  </label>
                </div>
                <div className="row">
                  <label className="radio">Email：{form.receiverEmail}</label>
                </div>
                <div className="row wrap">
                  <span className="bill">發票類型：</span>
                  <label className="radio">{form.invoiceType}</label>
                </div>
              </div>
            </div>

            {/* 訂單金額摘要 */}
            <div className="panel">
              <h3 className="panel-title">訂單金額</h3>
              <div className="panel-body">
                <ul className="summary-list">
                  <li className="row">
                    <span className="label">商品總額</span>
                    <span>${subtotal}</span>
                  </li>
                  <li className="row">
                    <span className="label">運費</span>
                    <span>${shipping}</span>
                  </li>
                  <li className="row">
                    <span className="label">折扣</span>
                    <span>-{discount}</span>
                  </li>
                  <li className="row total">
                    <span className="label">總付款額</span>
                    <div className="right">
                      <div>共 {count} 件</div>
                      <div>${total}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="actions">
              <button
                className="confirm-btn btn-secondary"
                type="button"
                onClick={() => (window.location.href = "/cart/checkout")}
              >
                回到上一頁
              </button>
              <button
                className="confirm-btn btn-primary"
                type="button"
                onClick={handleSubmitOrder}
              >
                送出訂單
              </button>
            </div>
          </section>

          <RecommendList recommend={recommend} />
        </div>
      </main>
      <Footer />
    </>
  );
}
