import "./cart.css";
export default function CartSummary({ total, discount, shipping, count }) {
  return (
    <div className="cart-summary">
      <h3>結帳明細</h3>
      <div className="summarycontainer">
        <ul>
          <li>運費 <span>{shipping}</span></li>
          <li className="total">
            <span>總計</span>
            <div className="right">
              <div>共 {count} 件</div>
              <div>折扣 -{discount}</div>
              <div>總共 {total}</div>
            </div>
          </li>
        </ul>
        <button className="btn-checkout">結帳 ({count})</button>
      </div>
    </div>
  );
}
