"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "./confirm.css";

// 推薦商品假資料
const recommend = Array(9).fill({
    img: "https://picsum.photos/id/1058/600/400",
    title: "A4tech 雙飛燕 Bloody S98 飛行者 RGB機械式鍵盤 熱插拔 紅軸 英文",
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

    useEffect(() => {
        setForm(getCheckoutForm());
    }, []);

    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <CartHeader />
                <CartSteps active={2} />
                <div className="container">
                    {/* 頂部：購物車 + 回上頁 + 流程條 */}
                    <div className="cart-header">
                        <div className="cartIcon">
                            <i className="fas fa-shopping-cart"></i> 購物車
                        </div>
                        <button className="backtomain">
                            <i className="fa-solid fa-turn-down"></i>回上頁
                        </button>
                    </div>

                    <div className="cart-steps">
                        <div className="cart-step done">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">訂單明細</div>
                        </div>
                        <div className="cart-step done">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">填寫收件資料</div>
                        </div>
                        <div className="cart-step active">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">確認訂單</div>
                        </div>
                        <div className="cart-step">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">購物完成</div>
                        </div>
                    </div>

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
                                        <span className="label">小計</span><span>$5,300</span>
                                    </li>
                                    <li className="row">
                                        <span className="label">運費</span><span>$60</span>
                                    </li>
                                    <li className="row">
                                        <span className="label">折扣</span><span>-$50</span>
                                    </li>
                                    <li className="row total">
                                        <span className="label">總計</span>
                                        <div className="right">
                                            <div>共 2 件</div>
                                            <div>總共 $5,310</div>
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

                    {/* 推薦商品 */}
                    <section className="recommend-section">
                        <div className="recommend-title">
                            <i className="fa-solid fa-heart"></i>你可能會感興趣的...
                        </div>
                        <div className="recommend-list">
                            {recommend.map((item, i) => (
                                <div className="recommend-item" key={i}>
                                    <img src={item.img} alt={`商品${i + 1}`} />
                                    <div className="recommend-item-title">{item.title}</div>
                                    <div className="recommend-item-footer">
                                        <div className="recommend-price">{item.price}</div>
                                        <button className="recommend-btn">
                                            <i className="fa-solid fa-plus"></i>
                                            <i className="fa-solid fa-cart-shopping"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    );
}
