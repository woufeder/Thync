import { useState, useEffect } from "react";
import { useProduct } from "@/hooks/use-product";
import CartTable from "./cartTable";
import CartSummary from "./cartSummary";
import CartCouponArea from "@/app/_components/cart/CartCouponArea";

export default function CartListPage({
  items,
  setItems,
  recommend,
  couponCode,
  setCouponCode,
  userId,
  couponMsg,
  setCouponMsg,
}) {
  // 從 localStorage 讀取 cart 資料
  useEffect(() => {
    if (!userId) return; // 沒有登入就不要讀
    const cart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
    if (cart.length) setItems(cart);
  }, [userId, setItems]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    }
  }, [items, userId]);

  const { products } = useProduct();
  // 父層傳入 setItems
  // 數量變更處理
  function onQtyChange(item, delta) {
    // 更新 items 數量
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
      )
    );
  }

  // 刪除商品處理
  function onRemove(item) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  // 動態計算金額
  const total = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  );
  const shipping = 60; // 可根據條件調整

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  return (
    <>
      <main className="container ">
        <div className="cart-container">
          <div className="cart-main">
            <CartTable
              items={items}
              onQtyChange={onQtyChange}
              onRemove={onRemove}
            />
            <hr className="cart-line" />

            {/* 優惠券區塊 */}
            <CartCouponArea
              userId={userId}
              total={total}
              onApply={(discount, coupon) => {
                setDiscount(discount);
                setSelectedCoupon(coupon);
                setCouponCode(coupon.code);

                // 🔹 同步存入 localStorage，讓 Checkout / Confirm 頁能讀到
                localStorage.setItem("discount", discount);
                localStorage.setItem("couponCode", coupon.code);
                localStorage.setItem("couponType", coupon.type);
              }}
            />
          </div>
          <div className="cart-summary-wrapper">
            <CartSummary
              items={items}
              discount={discount}
              coupon={selectedCoupon}
              onCheckout={() => {
                window.location.href = "/cart/checkout";
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
