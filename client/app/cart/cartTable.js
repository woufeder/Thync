import "./cart.css";
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
              <img src={item.img} alt={item.title} />
              <span>{item.title}</span>
            </td>
            <td>{item.price}</td>
            <td className="qty-control">
              <button onClick={() => onQtyChange(item, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => onQtyChange(item, 1)}>+</button>
            </td>
            <td>{item.subtotal}</td>
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
