"use client";

import { useState, useEffect } from "react";
import CouponCard from "./CouponCard";
import "./CouponArea.css";

export default function CouponArea() {
  const [coupons, setCoupons] = useState([]);

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
        setCoupons(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("讀取優惠券失敗:", err);
        setCoupons([]); // 發生錯誤時也給空陣列
      }
    }
    fetchCoupons();
  }, []);

  return (
    <div className="coupon-area">
      {/* <div className="title">我的優惠券</div> */}
      <div className="coupon-grid">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            type={
              coupon.type === 0
                ? "折價券"
                : coupon.type === 1
                ? "折扣券"
                : coupon.type === 2
                ? "免運券"
                : "其他"
            }
            name={coupon.code}
            description={coupon.desc}
            expireDate={`使用期限 ${new Date(
              coupon.expires_at
            ).toLocaleDateString()}`}
            status={
              new Date(coupon.expires_at) < new Date()
                ? "expired"
                : coupon.is_used
                ? "used"
                : "usable"
            }
          />
        ))}
      </div>
    </div>
  );
}
