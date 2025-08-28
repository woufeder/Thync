"use client";

import "./cartShared.css";

export default function CartSteps({ active = 0 }) {
  const steps = ["訂單明細", "填寫收件資料", "確認訂單", "購物完成"];
  return (
    <div className="cart-steps">
      {steps.map((label, i) => (
        <div key={i} className={`cart-step ${i === active ? "active" : ""}`}>
          <div className="cart-step-circle"></div>
          <div className="cart-step-label">{label}</div>
        </div>
      ))}
    </div>
  );
}