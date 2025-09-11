"use client";

import styles from "@/styles/order.css";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb";
import Sidebar from "@/app/_components/user/sidebar";
import Footer from "@/app/_components/footer";

export default function UserPage() {
  const { user, setUser } = useAuth();

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return (
      <div>
        <Header />
        <div className="d-flex container h-700 mt-4 mb-4">
          <Sidebar />

          <div className="main-content">
            <div className="breadcrumb">
              <Breadcrumb />
            </div>

            {/* 電腦版 */}
            <div className="table-container hidden-mobile">
              <table>
                <thead>
                  <tr>
                    <th>訂單編號</th>
                    <th>購買日期</th>
                    <th>出貨日期</th>
                    <th>付款方式</th>
                    <th>訂單金額</th>
                    <th>狀態</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href="#" className="order-link">
                        964591253761
                      </a>
                    </td>
                    <td>2025-09-01</td>
                    <td>2025-09-03</td>
                    <td>線界付款</td>
                    <td>NT$ 1,200</td>
                    <td>
                      <span className="status status-paid">已付款</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#" className="order-link">
                        964591253761
                      </a>
                    </td>
                    <td>2025-09-01</td>
                    <td>2025-09-03</td>
                    <td>線界付款</td>
                    <td>NT$ $1,200</td>
                    <td>
                      <span className="status status-unpaid">未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#" className="order-link">
                        964591253761
                      </a>
                    </td>
                    <td>2025-09-01</td>
                    <td>2025-09-03</td>
                    <td>線界付款</td>
                    <td>NT$ $1,200</td>
                    <td>
                      <span className="status status-cancelled">已取貨</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* 手機版 */}
            <div className="orders-container hidden-pc">
              {/* 訂單卡片 1 */}
              <div className="order-card">
                <div className="order-header">
                  <span className="order-number">訂單編號：964591253761</span>
                  <span className="order-status">已付款</span>
                </div>
                <div className="order-body">
                  <div className="product-section">
                    <div className="product-image">
                      <Image
                        src="/images/product-img.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="price">NT$ 1,200</div>
                    <button className="detail-button">詳情</button>
                  </div>
                </div>
              </div>

              {/* 訂單卡片 2 */}
              <div className="order-card">
                <div className="order-header">
                  <span className="order-number">訂單編號：964591253761</span>
                  <span className="order-status">已付款</span>
                </div>
                <div className="order-body">
                  <div className="product-section">
                    <div className="product-image">
                      <Image
                        src="/images/product-img2.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="price">NT$ 1,200</div>
                    <button className="detail-button">詳情</button>
                  </div>
                </div>
              </div>

              {/* 訂單卡片 3 */}
              <div className="order-card">
                <div className="order-header">
                  <span className="order-number">訂單編號：964591253761</span>
                  <span className="order-status">已付款</span>
                </div>
                <div className="order-body">
                  <div className="product-section">
                    <div className="product-image">
                      <Image
                        src="/images/product-img3.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                  <div className="price-section">
                    <div className="price">NT$ 1,200</div>
                    <button className="detail-button">詳情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
