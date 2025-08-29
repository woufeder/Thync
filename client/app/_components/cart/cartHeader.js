"use client";

import "./cartShared.css";

export default function CartHeader({ title = "購物車" }) {
  return (
    <div className="cart-header">
      <div className="cartIcon">
        <i className="fas fa-shopping-cart"></i> {title}
      </div>
      <button className="backtomain" onClick={() => window.history.back()}>
        <i className="fa-solid fa-turn-down"></i>回上頁
      </button>
    </div>
  );
}

