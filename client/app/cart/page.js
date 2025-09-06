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
  const userId = 1;
  const recommend = Array(6).fill({
    img: "https://picsum.photos/id/1058/600/400",
    title: "A4tech 雙飛燕 Bloody S98",
    price: "$2390",
  });

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
            recommend={recommend}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discount={discount}
            setDiscount={setDiscount}
            userId={userId}
          />
        )}
        {/* 推薦商品區塊 */}
        <RecommendList recommend={recommend} />
      </main>

        <Footer />

    </>
  );
}
