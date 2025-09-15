"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { jwtDecode } from "jwt-decode";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "../_components/header";
import Footer from "../_components/footer";
import CartListPage from "./cartListPage";
import EmptyCartPage from "./emptyCart";

export default function CartPage() {
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [userId, setUserId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // JWT payload 只有 { mail, img }，這裡用 mail 當 key
        setUserId(decoded.mail);

      } catch (err) {
        console.error("Token 解碼失敗:", err);
      }
    }
  }, []);

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

  // 沒有登入不能夠觀看1
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/user/login";
    }
  }, [user, isLoading]);

  if (!mounted) return null; // SSR 階段不輸出任何東西

  if (isLoading || !user) return null;

  if (user) {
    return (
      <>
        <Header />
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
          <div className="container">
            <RecommendList />
          </div>

        </main>

        <Footer />
      </>
    );
  }
}
