"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
export default function CheckoutPage() {
    // 假資料，未來可串接 API
    const items = [];
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
                                        <input type="radio" name="ship" defaultChecked /> 7-11取貨
                                    </label>
                                    <label className="radio">
                                        <input type="radio" name="ship" /> 宅配到府
                                    </label>
                                </div>
                                <div className="form-row">
                                    <label>收貨人</label>
                                    <input type="text" placeholder="請輸入真實中文姓名" />
                                    <label>手機號碼</label>
                                    <input type="text" placeholder="請輸入手機號碼" />
                                </div>
                                <div className="row">
                                    <label>取貨門市</label>
                                    <button className="btn btn-light" type="button">
                                        依地圖選擇
                                    </button>
                                </div>
                                <div className="row">
                                    <div className="row store-info">
                                        <label>門市名稱：—</label>
                                        <label>門市地址：—</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 付款方式 */}
                        <div className="panel">
                            <h3 className="panel-title">付款方式</h3>
                            <div className="panel-body">
                                <label className="radio">
                                    <input type="radio" name="pay" defaultChecked /> 7-11取貨付款
                                </label>
                                <label className="radio">
                                    <input type="radio" name="pay" /> ATM轉帳
                                </label>
                            </div>
                        </div>
                        {/* 購買人資訊 */}
                        <div className="panel">
                            <h3 className="panel-title">購買人資訊</h3>
                            <div className="panel-body">
                                <div className="form-row">
                                    <label>姓名</label>
                                    <input type="text" placeholder="請輸入真實中文姓名" />
                                    <label>手機號碼</label>
                                    <input type="text" placeholder="請輸入手機號碼" />
                                </div>
                                <div className="form-row">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="email-input"
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="row wrap">
                                    <span className="bill">發票類型</span>
                                    <label className="radio">
                                        <input type="radio" name="inv" defaultChecked /> 手機載具
                                    </label>
                                    <label className="radio">
                                        <input type="radio" name="inv" /> 會員載具
                                    </label>
                                    <label className="radio">
                                        <input type="radio" name="inv" /> 捐贈發票
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* 底部操作 */}
                        <div className="actions">
                            <button className="btn btn-secondary" type="button">
                                回到購物車
                            </button>
                            <button className="btn btn-primary" type="button">
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
