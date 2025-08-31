import styles from "./emptyCart.module.css";

export default function EmptyCartPage() {
  return (
    <div className={styles.cartEmpty}>
      <div className={styles.cartEmptyTitle}>你的購物車是空的</div>
      <div className={styles.cartEmptyDesc}>
        看來你還沒有做出選擇。<br />我們去購物吧！
      </div>
      <button
        className={styles.cartEmptyBtn}
        type="button"
        onClick={() => window.location.href = "/products"}
      >
        現在開始購物
      </button>
    </div>
  );
}