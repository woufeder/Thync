import { useProduct } from "@/hooks/use-product";
import CartTable from "./cartTable";
import CartSummary from "./cartSummary";

export default function CartListPage({
  items,
  setItems,
  recommend,
  couponCode,
  setCouponCode,
  discount,
  setDiscount,
  userId,
  couponMsg,
  setCouponMsg,
}) {
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
    (sum, i) => sum + (i.priceNum || 0) * (i.qty || 1),
    0
  );
  const shipping = 60; // 可根據條件調整

  async function handleUseCoupon() {
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: couponCode }),
      });
      if (!res.ok) throw new Error("伺服器錯誤，請稍後再試");
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discount);
        setCouponMsg("折扣已套用！");
      } else {
        setDiscount(0);
        setCouponMsg(data.message || "折扣碼無效");
      }
    } catch (err) {
      setDiscount(0);
      setCouponMsg(err.message || "伺服器錯誤，請稍後再試");
    }
  }

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
            <div className="coupon-box">
              <input
                className="inputcoupon"
                type="text"
                placeholder="輸入折扣碼"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
              />
              <button className="btn-use" onClick={handleUseCoupon}>
                使用
              </button>
              {couponMsg && <div className="coupon-msg">{couponMsg}</div>}
            </div>
          </div>

          <CartSummary
            items={items}
            discount={discount}
            couponCode={couponCode}
            onCheckout={() => { window.location.href = "/cart/checkout"; }}
          />
        </div>
      </main>
    </>
  );
}
