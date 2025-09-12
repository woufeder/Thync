export default function CouponCard({
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
      className={`coupon-scroll-card ${isActive ? "active" : ""} ${
        isDisabled ? "disabled" : ""
      }`}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="top">
        <div className="type">{type}</div>
        <div className="name">{name}</div>
        <div className="desc">{description}</div>
        <div className="amount">{amount}</div>
      </div>

      <div className="bottom">
        <div className="expire">{expireDate}</div>
      </div>
    </div>
  );
}
