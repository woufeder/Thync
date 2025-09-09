"use client";

import styles from "@/styles/user-center.css";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "../_components/header";
import Breadcrumb from "../_components/breadCrumb";
import Sidebar from "../_components/user/sidebar";
import Footer from "../_components/footer";

export default function UserEditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  console.log("UserEditPage - isLoading:", isLoading, "user:", user);

  // 沒有登入不能夠觀看1
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/user/login");
    }
  }, [user, isLoading]);

  if (isLoading || !user) return null;

  if (user) {
    return (
      <div>
        <Header />
        <div className="d-flex container mt-4 mb-4">
          <Sidebar />

          <div className="main-content">
            <div className="breadcrumb">
              <Breadcrumb />
            </div>

            <div className="hidden">
              <div className="d-flex flex-row justify-content-between">
                <div className="profile">
                  <div className="avatar-wrapper">
                    <div className="avatar">
                      <img src="./images/user-photo.jpg" alt="avatar" />
                      <div className="camera">
                        <i className="fa-solid fa-camera"></i>
                      </div>
                    </div>
                  </div>
                  <div className="greet">
                    <div className="greet-word">您好！</div>
                    <div className="user-name">sally123</div>
                  </div>
                </div>
                <button className="logout">
                  <i className="fa-solid fa-right-to-bracket"></i>登出
                </button>
              </div>
              <hr />
            </div>

            <div className="middle-content">
              <h1>會員中心</h1>
              <div className="tiles">
                <Link href="/user/edit" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-user"></i>
                    <div className="label">會員資料管理</div>
                  </div>
                </Link>
                <Link href="/user/order" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-gift"></i>
                    <div className="label">訂單查詢</div>
                  </div>
                </Link>
                <Link href="#" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-bell"></i>
                    <div className="label">貨到通知</div>
                  </div>
                </Link>
                <Link href="#" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-ticket"></i>
                    <div className="label">我的優惠券</div>
                  </div>
                </Link>
                <Link href="/user/wishlist" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-heart"></i>
                    <div className="label">追蹤商品</div>
                  </div>
                </Link>
                <Link href="/user/favorites" className="tile">
                  <div className="inner">
                    <i className="fa-solid fa-bookmark"></i>
                    <div className="label">已收藏文章</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
