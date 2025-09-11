"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "../_components/header";
import Footer from "../_components/footer";
import CartListPage from "./cartListPage";
import EmptyCartPage from "./emptyCart";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  // TODO: 取得登入會員 id，暫用假資料
  const userId = 97;


  useEffect(() => {
    // 從 localStorage 取得購物車資料
    const cartData = localStorage.getItem("cartItems");
    if (cartData) {
      setItems(JSON.parse(cartData));
    }
  }, []);

  // 當 items 變動時，寫回 localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);



  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <CartHeader />
        <CartSteps active={0} />
        {items.length === 0 ? (
          <EmptyCartPage />
        ) : (
          <CartListPage
            items={items}
            setItems={setItems}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discount={discount}
            setDiscount={setDiscount}
            userId={userId}
          />
        )}
        {/* 推薦商品區塊 */}
        <RecommendList />
      </main>

      <Footer />

    </>
  );
}
