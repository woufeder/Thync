"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import CouponCard from "./CouponCard";
import "./CouponArea.css";

export default function CouponArea() {
  const [activeTab, setActiveTab] = useState("unclaimed");
  const [activeFilter, setActiveFilter] = useState("all");
  const [couponCode, setCouponCode] = useState("");

  const sampleCoupons = [
    {
      type: "折價券",
      name: "會員專屬",
      description: "購買限定活動商品即可使用",
      amount: "NT$100",
      expireDate: "領取期限 2025/8/31",
    },
    {
      type: "新用戶獨享",
      name: "註冊禮",
      description: "新用戶首次下單即可使用",
      amount: "NT$50",
      expireDate: "領取期限 2025/12/31",
    },
  ];

  // ⬇️ 在這裡定義 tabs
  const tabs = [
    { id: "unclaimed", label: "未領取" },
    { id: "claimed", label: "已領取" },
    { id: "history", label: "歷史紀錄" },
  ];

  return (
    <div className="coupon-area">
      <div className="breadcrumb">
        <FontAwesomeIcon icon={faHome} />
        <span>首頁</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>會員中心</span>
        <FontAwesomeIcon icon={faChevronRight} />
        <span>我的優惠券</span>
      </div>

      <div className="title">我的優惠券</div>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="coupon-grid">
        {sampleCoupons.map((coupon, index) => (
          <CouponCard
            key={index}
            type={coupon.type}
            name={coupon.name}
            description={coupon.description}
            amount={coupon.amount}
            expireDate={coupon.expireDate}
            onClaim={() => console.log("Claimed", index)}
          />
        ))}
      </div>
    </div>
  );
}
