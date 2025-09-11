"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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
      <div className="title">我的優惠券</div>
      <div className="coupon-grid">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            type={coupon.type === 0 ? "折價券" : "百分比/免運"} // 可自行轉換
            name={coupon.code}
            description={coupon.desc}
            amount={
              coupon.type === 1 ? `${coupon.value}% OFF` : `NT$${coupon.value}`
            }
            expireDate={`使用期限 ${new Date(
              coupon.expires_at
            ).toLocaleDateString()}`}
            onClaim={() => console.log("使用", coupon)}
          />
        ))}
      </div>
    </div>
  );
}
