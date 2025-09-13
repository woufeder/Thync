"use client";

import "@/styles/order.css";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb";
import Sidebar from "@/app/_components/user/sidebar";
import Footer from "@/app/_components/footer";

export default function UserOrderPage() {
  const { user, setUser } = useAuth();

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 單一訂單資料狀態
  const [order, setOrder] = useState(null);
  const params = useParams();
  const orderNo = params?.orderNo;
  useEffect(() => {
    if (!user || !orderNo) return;
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("reactLoginToken");
        const res = await fetch(`http://localhost:3007/api/orders/${orderNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.status === "success" && result.data) {
          setOrder(result.data);
        } else {
          setOrder(null);
        }
      } catch (err) {
        setOrder(null);
        console.error("單一訂單資料獲取失敗", err);
      }
    };
    fetchOrder();
  }, [user, orderNo]);

// 日期格式化工具
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = (n) => n.toString().padStart(2, "0");
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
};

  if (!user) {
    return (
      <div>
        <Header />
      </div>
    );
  }
  if (!order) {
    return (
      <div>
        <Header />
        <div className="container mt-4 mb-4">
          <div className="main-content">
            <h2>訂單明細</h2>
            <div>載入中...</div>

          </div>
        </div>
        <Footer />
      </div>
    );
  }
  // 僅顯示必要欄位
  return (
    <div>
      <Header />
      <div className="container mt-4 mb-4">
        <div className="main-content">
          <h2>訂單明細</h2>
          <div style={{ marginBottom: 24 }}>
            <strong>訂單編號：</strong> {order.numerical_order}<br />
            <strong>訂單狀態：</strong> {order.status_now === "paid" ? "已付款" : order.status_now === "pending" ? "未付款" : order.status_now}<br />
            <strong>訂購日期：</strong> {formatDate(order.order_date)}<br />
            <strong>付款方式：</strong> {order.pay_method === "TWQR_OPAY" ? "信用卡" : order.pay_method}<br />
          </div>
          <h3>商品明細</h3>
          <table style={{ width: "100%", marginBottom: 24 }}>
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>數量</th>
                <th>單價</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.product_name || item.product_id}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "right" }}>
            <div>商品小計：${Math.floor(order.total)}</div>
            <div style={{ fontWeight: "bold", color: "#c62828", fontSize: 20 }}>訂單金額：${Math.floor(order.final_amount || order.total)}</div>
          </div>
          {/* 收件資訊區塊 */}
          <div style={{ marginTop: 40, border: "1px solid #ccc", borderRadius: 8, background: "#f9f9f9", padding: 24 }}>
            <h3 style={{ borderBottom: "1px solid #ccc", paddingBottom: 8, marginBottom: 16 }}>收件資訊</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <strong>收件姓名：</strong> {order.recipient || "-"}
              </div>
              <div>
                <strong>收件手機：</strong> {order.recipient_phone || "-"}
              </div>
              <div>
                <strong>收件門市：</strong> {order.delivery_store || "-"}
              </div>
              <div>
                <strong>收件地址：</strong> {order.delivery_address || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
