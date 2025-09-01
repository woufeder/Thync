"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "./confirm.css";

    // 推薦商品假資料（與 cartPage.js 統一格式）
    const recommend = Array(6).fill({
        img: "https://picsum.photos/id/1058/600/400",
        title: "A4tech 雙飛燕 Bloody S98",
        price: "$2390",
    });

function getCheckoutForm() {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem("checkoutForm");
        if (data) return JSON.parse(data);
    }
    return {};
}
export default function Page() {
    const [form, setForm] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        setForm(getCheckoutForm());
        const cartData = localStorage.getItem("cartItems");
        if (cartData) setCartItems(JSON.parse(cartData));
        // 折扣可根據 localStorage 或其他資料取得
        const discountData = localStorage.getItem("discount");
        setDiscount(discountData ? Number(discountData) : 0);
    }, []);

    // 動態計算金額
    const count = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    const subtotal = cartItems.reduce((sum, item) => sum + ((item.priceNum || 0) * (item.qty || 1)), 0);
    const shipping = form.shippingType === "宅配到府" ? 80 : 60;
    const total = subtotal + shipping - discount;

    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <CartHeader />
                <CartSteps active={2} />
                <div className="container">


                    {/* 收件與運送摘要 */}
                    <section className="checkout">
                        <div className="panel">
                            <h3 className="panel-title">收件與運送</h3>
                            <div className="panel-body">
                                <div className="row">
                                    <label className="radio">收貨人：{form.receiverName}</label>
                                    <label className="radio">手機號碼：{form.receiverPhone }</label>
                                </div>
                                <div className="row">
                                    <label className="radio">運送方式：{form.shippingType}</label>
                                    <label className="radio">門市名稱：{form.storeName}</label>
                                </div>
                                <div className="row">
                                    <label className="radio">門市地址：{form.storeAddress}</label>
                                </div>
                            </div>
                        </div>

                        {/* 付款方式摘要 */}
                        <div className="panel">
                            <h3 className="panel-title">付款方式</h3>
                            <div className="panel-body">
                                <label className="radio">7-11 取貨付款</label>
                            </div>
                        </div>

                        {/* 購買人資訊摘要 */}
                        <div className="panel">
                            <h3 className="panel-title">購買人資訊</h3>
                            <div className="panel-body">
                                <div className="row">
                                    <label className="radio">姓名：{form.receiverName}</label>
                                    <label className="radio">手機號碼：{form.receiverPhone }</label>
                                </div>
                                <div className="row">
                                    <label className="radio">Email：{form.receiverEmail}</label>
                                </div>
                                <div className="row wrap">
                                    <span className="bill">發票類型：</span>
                                    <label className="radio">{form.invoiceType }</label>
                                </div>
                            </div>
                        </div>

                        {/* 訂單金額摘要 */}
                        <div className="panel">
                            <h3 className="panel-title">訂單金額</h3>
                            <div className="panel-body">
                                <ul className="summary-list">
                                    <li className="row">
                                        <span className="label">小計</span><span>${subtotal}</span>
                                    </li>
                                    <li className="row">
                                        <span className="label">運費</span><span>${shipping}</span>
                                    </li>
                                    <li className="row">
                                        <span className="label">折扣</span><span>-{discount}</span>
                                    </li>
                                    <li className="row total">
                                        <span className="label">總計</span>
                                        <div className="right">
                                            <div>共 {count} 件</div>
                                            <div>總共 ${total}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 底部操作 */}
                                            <div className="actions">
                                                <button
                                                    className="btn btn-secondary"
                                                    type="button"
                                                    onClick={() => window.location.href = "/cart/checkout"}
                                                >
                                                    回到上一頁
                                                </button>
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={() => window.location.href = "/cart/success"}
                                                >
                                                    送出訂單
                                                </button>
                                            </div>
                    </section>

                    {/* 推薦商品區塊（與 cartPage.js 統一） */}
                    <RecommendList recommend={recommend} />
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
