"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "../success.css";


// 推薦商品假資料（與 cartPage.js 統一格式）
const recommend = Array(6).fill({
  img: "https://picsum.photos/id/1058/600/400",
  title: "A4tech 雙飛燕 Bloody S98",
  price: "$2390",
});

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderNo = params?.orderNo;
  return (
    <>
      <header>
        <Header />
      </header>
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
          <RecommendList recommend={recommend} />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}