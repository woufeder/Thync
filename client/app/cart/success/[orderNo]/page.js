"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";

import "@/app/_components/cart/cartShared.css";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderNo = params?.orderNo;
  return (
    <>
      <Header />
      <main>
        <CartHeader />
        <CartSteps active={3} />
        <div className="container">
          <hr className="progressLine" />
          <div className="section1">
            <div className="successMessage">
              <div className="thanks">感謝您的訂購！</div>
              <div className="orderNumber">訂單編號：{orderNo}</div>
              <button
                className="product"
                type="button"
                onClick={() => router.push("/products")}
              >
                繼續購物
              </button>
              <button
                className="order"
                type="button"
                onClick={() => router.push(`/user/orders/${orderNo}`)}
              >
                查看訂單狀態
              </button>
            </div>
          </div>
          <RecommendList />
        </div>
      </main>
      <Footer />
    </>
  );
}