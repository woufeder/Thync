"use client";

import "./cartShared.css";

export default function RecommendList({ items }) {
  return (
    <section className="recommend-section">
      <div className="recommend-title">
        <i className="fa-solid fa-heart"></i>你可能會感興趣的...
      </div>
      <div className="recommend-list">
        {(items ?? []).map((p, i) => (
          <div key={i} className="recommend-item">
            <img src={p.img} alt={p.title} />
            <div className="recommend-item-title">{p.title}</div>
            <div className="recommend-item-footer">
              <div className="recommend-price">{p.price}</div>
              <button className="recommend-btn">
                <i className="fa-solid fa-plus"></i>
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
