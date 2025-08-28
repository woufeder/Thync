import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import CartTable from "./cartTable";
import CartSummary from "./cartSummary";
import "./cart.css";

export default function CartListPage({ items, recommend }) {
    return (
        <main className="container">
            <CartHeader onBack={() => history.back()} />
            <CartSteps active={0} />

            <div className="cartContainer">
                <div className="cartMain">
                    <CartTable items={items} />
                    <div className="couponBox">
                        <input
                            className="inputCoupon"
                            type="text"
                            placeholder="輸入折扣碼"
                        />
                        <button className="btnUse">使用</button>
                    </div>
                </div>

                <CartSummary
                    total="$5240"
                    discount="$50"
                    shipping="$60"
                    count={items.length}
                />
            </div>

            <RecommendList items={recommend} />
        </main>
    );
}
