// app/_components/cart/CartCouponCard.js
import "./CartCoupon.css";

export default function CartCouponCard({
  type,
  name,
  description,
  amount,
  expireDate,
  isActive,
  isDisabled,
  onClick,
}) {
  return (
    <div
      className={`cart-coupon-card 
        ${isActive ? "active" : ""} 
        ${isDisabled ? "disabled" : ""}`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="coupon-left">
        <h4>{name}</h4>
        <p>{description}</p>
        <p>{expireDate}</p>
      </div>
      <div className="coupon-right">
        <span>{amount}</span>
      </div>
    </div>
  );
}
