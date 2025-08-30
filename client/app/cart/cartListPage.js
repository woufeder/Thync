import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import CartTable from "./cartTable";
import CartSummary from "./cartSummary";

export default function CartListPage({ items, recommend }) {
    return (
        <main className="container">
            <div className="cart-container">
                <div className="cart-main">
                    <CartTable items={items} />
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
    );
}
