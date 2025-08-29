import "./cart.css";
export default function CartSummary({ total, discount, shipping, count }) {
  return (
    <div className="cart-summary">
      <h3>結帳明細</h3>
      <div className="summarycontainer">
          <ul>
            <li>
              <span>付款方式</span>
              <div className="custom-select">
                <button className="cs-trigger" aria-expanded="false">
                  <span className="cs-text">貨到付款</span>
                </button>
                <ul className="cs-menu">
                  <li className="cs-option">貨到付款</li>
                  <li className="cs-option">信用卡</li>
                  <li className="cs-option">Line Pay</li>
                </ul>
              </div>
            </li>

            <li>
              <span>運送方式</span>
              <div className="custom-select">
                <button className="cs-trigger" aria-expanded="false">
                  <span className="cs-text">超商取貨</span>
                </button>
                <ul className="cs-menu">
                  <li className="cs-option">超商取貨</li>
                  <li className="cs-option">宅配到府</li>
                </ul>
              </div>
            </li>

            <li>
              運費 <span>{shipping}</span>
            </li>
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
