"use client";

import "@/styles/order.css";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb";
import Sidebar from "@/app/_components/user/sidebar";
import Footer from "@/app/_components/footer";

export default function UserOrderPage() {
  const { user, setUser } = useAuth();

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 訂單資料狀態
  const [orders, setOrders] = useState([]);
  // 取得訂單資料
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("reactLoginToken");
        const res = await fetch("http://localhost:3007/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        console.log("[訂單資料]", result);
        if (Array.isArray(result.data)) {
          setOrders(result.data);
          result.data.forEach((order, idx) => {
            console.log(`[訂單${idx}]`, order);
          });
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
        console.error("訂單資料獲取失敗", err);
      }
    };
    fetchOrders();
  }, [user]);

  // 日期格式化工具
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  function pad(n) { return n.toString().padStart(2, "0"); }
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

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
                    <th>訂單金額</th>
                    <th>訂購日期</th>
                    <th>付款方式</th>
                    <th>付款日期</th>
                    <th>取貨方式</th>
                    <th>訂單狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx}>
                      <td>
                        <a href={`/user/order/${order.numerical_order}`} className="order-link">
                          {order.numerical_order}
                        </a>
                      </td>
                      <td>
                        <p>${Math.floor(order.total)}</p>
                      </td>
                      <td>
                        <p>{formatDate(order.order_date)}</p>
                      </td>
                      <td>
                        <p>
                          {order.pay_method === "TWQR_OPAY"
                            ? "信用卡"
                            : order.pay_method}
                        </p>
                      </td>
                      <td>
                        <p>{order.paid_at ? formatDate(order.paid_at) : "無付款資訊"}</p>
                      </td>
                      <td>
                        <p> {order.delivery_method}</p>
                      </td>
                      <td>
                        <p
                          className={
                            order.status_now === "paid"
                              ? "status status-paid"
                              : order.status_now === "pending"
                              ? "status status-unpaid"
                              : order.status_now === "failed"
                              ? "status status-cancelled"
                              : "status"
                          }
                        >
                          {order.status_now === "paid"
                            ? "已付款"
                            : order.status_now === "pending"
                            ? "未付款"
                            : order.status_now === "failed"
                            ? "訂單失敗"
                            : order.status_now}
                        </p>
                      </td>
                    </tr>
                  ))}
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
                    {/* <div className="product-image">
                      <Image
                        src="/images/product-img.jpg"
                        alt=""
                        width={100}
                        height={100}
                      />
                    </div> */}
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
