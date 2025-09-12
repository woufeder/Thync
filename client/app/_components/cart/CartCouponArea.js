"use client";

import { useState, useEffect, useRef } from "react";
import CartCouponCard from "./CartCouponCard";
import "./CartCoupon.css";

export default function CartCouponArea({ userId, total, onApply }) {
  console.log("CartCouponArea rendered", userId, total);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const couponListRef = useRef(null);

  const scrollCoupons = (dir) => {
    const node = couponListRef.current;
    if (!node) return;
    const cardWidth = 375 + 16; // 卡片寬度+gap
    node.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("http://localhost:3007/api/coupon/available", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("reactLoginToken")}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        console.log("API 回傳優惠券", data);

        // 🔹 把後端數字型 type 轉成前端能讀的字串
        const normalized = data.map((c) => ({
          ...c,
          type:
            c.type === 0
              ? "amount"
              : c.type === 1
              ? "percent"
              : c.type === 2
              ? "free_shipping"
              : "unknown",
        }));

        console.log("轉換後的優惠券", normalized);

        setCoupons(normalized); // ✅ 設定到 state
      } catch (err) {
        console.error("載入優惠券失敗", err);
      }
    }
    fetchCoupons(); // 直接呼叫，不要判斷 userId
  }, []);

  function handleSelect(coupon) {
    const isValid = total >= coupon.min;
    if (!isValid) {
      alert(`❌ 此券需滿 ${coupon.min} 元才可使用`);
      return;
    }
    setSelectedCoupon(coupon);

    let discount = 0;
    if (coupon.type === "amount") {
      discount = coupon.value;
    } else if (coupon.type === "percent") {
      discount = Math.floor(total * (coupon.value / 100));
    } else if (coupon.type === "free_shipping") {
      discount = 0; // 免運不在這裡扣，由 CartSummary 處理
    }
    onApply(discount, coupon);
  }

  return (
    <div className="cart-coupon-wrapper">
      <div className="cart-coupon-area">
        <h3>可用的優惠券</h3>

        <button className="scroll-btn left" onClick={() => scrollCoupons(-1)}>
          ←
        </button>
        <div className="coupon-scroll-list" ref={couponListRef}>
          {coupons.map((c) => {
            const discountPreview =
              c.type === "amount"
                ? `折 $${c.value}`
                : c.type === "percent"
                ? `打 ${c.value}%`
                : "免運";

            return (
              <CartCouponCard
                key={c.id}
                type={c.type}
                name={c.desc}
                description={`滿 ${c.min} 可用`}
                amount={discountPreview}
                expireDate={`到期日：${new Date(
                  c.expires_at
                ).toLocaleDateString()}`}
                isActive={selectedCoupon?.id === c.id}
                isDisabled={total < c.min}
                onClick={() => handleSelect(c)}
              />
            );
          })}
        </div>
        <button className="scroll-btn right" onClick={() => scrollCoupons(1)}>
          →
        </button>
      </div>
    </div>
  );
}
