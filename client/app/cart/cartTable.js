import "./cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function CartTable({ items, onQtyChange, onRemove }) {
  return (
    <table className="cart-table">
      <thead>
        <tr>
          <th>商品明細</th>
          <th>價格</th>
          <th>數量</th>
          <th>小計</th>
          <th>修改明細</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td className="product-info">
              <img
                src={`/images/products/uploads/${item.images[0]?.file}`}
                alt={item.product_name}
              />
              <span>{item.product_name}</span>
            </td>
            <td>${item.price || 0}</td>
            <td className="qty-control">
              <div className="d-flex align-items-center gap-2">
                <button onClick={() => onQtyChange(item, -1)} className="btn btn-outline-secondary"><FontAwesomeIcon icon={faMinus} /></button>
                <span>{item.qty || 1}</span>
                <button onClick={() => onQtyChange(item, 1)} className="btn btn-outline-secondary"><FontAwesomeIcon icon={faPlus} /></button>
              </div>
            </td>
            <td>${(item.price || 0) * (item.qty || 1)}</td>
            <td>
              <button className="btn-remove" onClick={() => onRemove(item)}>
                刪除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
