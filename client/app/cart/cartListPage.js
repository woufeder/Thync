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
  // 新增：自動從 localStorage 讀取 cart 資料
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length) setItems(cart);
  }, [setItems]);

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
      <main className="container">
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
                setCouponCode(coupon.code);
              }}
            />
            
          </div>
          <CartSummary
            items={items}
            discount={discount}
            couponCode={couponCode}
            onCheckout={() => {
              window.location.href = "/cart/checkout";
            }}
          />
        </div>
      </main>
    </>
  );
}
