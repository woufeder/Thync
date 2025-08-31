"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "./checkout.css";

export default function CheckoutPage() {
    // 表單狀態
    const [form, setForm] = useState({
        receiverName: "",
        receiverPhone: "",
        receiverEmail: "",
        shippingType: "7-11取貨",
        storeName: "",
        storeAddress: "",
        invoiceType: "手機載具",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleConfirm() {
        localStorage.setItem("checkoutForm", JSON.stringify(form));
        window.location.href = "/cart/confirm";
    }

    // 推薦商品假資料
    const recommend = Array(9).fill({
        img: "https://picsum.photos/id/1058/600/400",
        title: "A4tech 雙飛燕 Bloody S98 飛行者 RGB機械式鍵盤 熱插拔 紅軸 英文",
        price: "$2390",
    });

    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <CartHeader />
                <CartSteps active={1} />
                <div className="container">
                    {/* 填寫收件資料區 */}
                    <section className="checkout">
                        {/* 寄送方式 */}
                        <div className="panel">
                            <h3 className="panel-title">寄送方式</h3>
                            <div className="panel-body">
                                <div className="row">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="shippingType"
                                            value="7-11取貨"
                                            checked={form.shippingType === "7-11取貨"}
                                            onChange={handleChange}
                                        /> 7-11取貨
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="shippingType"
                                            value="宅配到府"
                                            checked={form.shippingType === "宅配到府"}
                                            onChange={handleChange}
                                        /> 宅配到府
                                    </label>
                                </div>
                                <div className="form-row">
                                    <label>收貨人</label>
                                    <input
                                        type="text"
                                        name="receiverName"
                                        placeholder="請輸入真實中文姓名"
                                        value={form.receiverName}
                                        onChange={handleChange}
                                    />
                                    <label>手機號碼</label>
                                    <input
                                        type="text"
                                        name="receiverPhone"
                                        placeholder="請輸入手機號碼"
                                        value={form.receiverPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="row">
                                    <label>取貨門市</label>
                                    <button className="btn btn-light" type="button">
                                        依地圖選擇
                                    </button>
                                </div>
                                <div className="row">
                                    <div className="row store-info">
                                        <label>
                                            門市名稱：
                                            <input
                                                type="text"
                                                name="storeName"
                                                placeholder="請輸入門市名稱"
                                                value={form.storeName}
                                                onChange={handleChange}
                                            />
                                        </label>
                                        <label>
                                            門市地址：
                                            <input
                                                type="text"
                                                name="storeAddress"
                                                placeholder="請輸入門市地址"
                                                value={form.storeAddress}
                                                onChange={handleChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 付款方式 */}
                        <div className="panel">
                            <h3 className="panel-title">付款方式</h3>
                            <div className="panel-body">
                                <label className="radio">
                                    <input
                                        type="radio"
                                        name="pay"
                                        value="7-11取貨付款"
                                        defaultChecked
                                    /> 7-11取貨付款
                                </label>
                                <label className="radio">
                                    <input
                                        type="radio"
                                        name="pay"
                                        value="ATM轉帳"
                                    /> ATM轉帳
                                </label>
                            </div>
                        </div>
                        {/* 購買人資訊 */}
                        <div className="panel">
                            <h3 className="panel-title">購買人資訊</h3>
                            <div className="panel-body">
                                <div className="form-row">
                                    <label>姓名</label>
                                    <input
                                        type="text"
                                        name="receiverName"
                                        placeholder="請輸入真實中文姓名"
                                        value={form.receiverName}
                                        onChange={handleChange}
                                    />
                                    <label>手機號碼</label>
                                    <input
                                        type="text"
                                        name="receiverPhone"
                                        placeholder="請輸入手機號碼"
                                        value={form.receiverPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="receiverEmail"
                                        className="email-input"
                                        placeholder="name@example.com"
                                        value={form.receiverEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="row wrap">
                                    <span className="bill">發票類型</span>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="invoiceType"
                                            value="手機載具"
                                            checked={form.invoiceType === "手機載具"}
                                            onChange={handleChange}
                                        /> 手機載具
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="invoiceType"
                                            value="會員載具"
                                            checked={form.invoiceType === "會員載具"}
                                            onChange={handleChange}
                                        /> 會員載具
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="invoiceType"
                                            value="捐贈發票"
                                            checked={form.invoiceType === "捐贈發票"}
                                            onChange={handleChange}
                                        /> 捐贈發票
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* 底部操作 */}
                        <div className="actions">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={() => window.location.href = "/cart"}
                            >
                                回到購物車
                            </button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleConfirm}
                            >
                                確認訂單
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
// ...existing code...
