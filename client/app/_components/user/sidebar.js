import React from "react";
import styles from "@/styles/user-center.css";
import { useAuth } from "@/hooks/use-auth";

const Sidebar = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="sidebar me-4">
        <div className="upper">
          <div className="profile">
            <div className="avatar-wrapper">
              <div className="avatar">
                <img src={user?.img} alt="avatar" />
                <div className="camera">
                  <i className="fa-solid fa-camera"></i>
                </div>
              </div>
            </div>
            <div className="greet">
              <div className="greet-word">您好！</div>
              <div className="user-name">{user?.account || "未登入"}</div>
            </div>
          </div>
          <nav className="menu">
            <a href="#">
              <i className="fa-solid fa-user"></i>會員資料管理
            </a>
            <a href="#">
              <span className="icon">
                <i className="fa-solid fa-gift"></i>
              </span>
              訂單查詢
            </a>
            <a href="#">
              <span className="icon">
                <i className="fa-solid fa-bell"></i>
              </span>
              貨到通知
            </a>
            <a href="#">
              <span className="icon">
                <i className="fa-solid fa-ticket"></i>
              </span>
              我的優惠券
            </a>
            <a href="#">
              <span className="icon">
                <i className="fa-solid fa-heart"></i>
              </span>
              追蹤商品
            </a>
            <a href="#">
              <span className="icon">
                <i className="fa-solid fa-bookmark"></i>
              </span>
              已收藏文章
            </a>
          </nav>
        </div>
        <button className="logout">
          <i className="fa-solid fa-right-to-bracket"></i>登出
        </button>
      </div>
    </>
  );
};

export default Sidebar;
