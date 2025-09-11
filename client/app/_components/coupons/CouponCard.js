export default function CouponCard({
  type,
  name,
  description,
  amount,
  expireDate,
  onClaim,
}) {
  return (
    <div className="coupon-card">
      <div className="top">
        <div className="type">{type}</div>
        <div className="name">{name}</div>
        <div className="desc">{description}</div>
        <div className="amount">{amount}</div>
      </div>

      <div className="bottom">
        <div className="expire">{expireDate}</div>
        <button onClick={onClaim} className="get-btn">
          可使用
        </button>
      </div>
    </div>
  );
}
