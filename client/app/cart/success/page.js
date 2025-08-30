"use client";

import { useEffect, useState } from "react";
import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import "./OrderSuccessPage.css";

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
                <CartSteps active={2} />
                <div className="container">
                    {/* 頂部：購物車 + 回上頁 + 流程條 */}
                    <div className="cart-header">
                        <div className="cartIcon">
                            <i className="fas fa-shopping-cart"></i> 購物車
                        </div>
                        <div className="backtomain">
                            <i className="fa-solid fa-turn-down"></i>回上頁
                        </div>
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
                        <div className="cart-step done">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">確認訂單</div>
                        </div>
                        <div className="cart-step active">
                            <div className="cart-step-circle"></div>
                            <div className="cart-step-label">購物完成</div>
                        </div>
                    </div>

                    <hr className="progressLine" />

                    {/* 成功訊息 */}
                    <div className="section1">
                        <div className="successMessage">
                            <div className="thanks">感謝您的訂購！</div>
                            <div className="orderNumber">訂單編號：</div>
                            <button className="product">繼續購物</button>
                            <button className="order">查看訂單狀態</button>
                        </div>
                    </div>

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
// ...existing code...
