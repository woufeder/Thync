import { useProduct } from "@/app/hooks/use-product";
import CartTable from "./cartTable";
import CartSummary from "./cartSummary";

export default function CartListPage({ items, recommend }) {
    const { products } = useProduct();

    // 數量變更處理
    function onQtyChange(item, delta) {
        // 實際專案可用 setState 更新 items
        alert(`商品「${item.title}」數量變更：${delta > 0 ? "+" : "-"}`);
    }

    // 刪除商品處理
    function onRemove(item) {
        // 實際專案可用 setState 移除 items
        alert(`已刪除商品「${item.title}」`);
    }

    return (
        <>
            <main className="container">
                <div className="cart-container">
                    <div className="cart-main">
                        <CartTable items={items} onQtyChange={onQtyChange} onRemove={onRemove} />
                        <div className="coupon-box">
                            <input
                                className="inputcoupon"
                                type="text"
                                placeholder="輸入折扣碼"
                            />
                            <button className="btn-use">使用</button>
                        </div>
                    </div>

                    <CartSummary
                        total="$5240"
                        discount="$50"
                        shipping="$60"
                        count={items.length}
                    />
                </div>

            </main>
        </>
    );
}
