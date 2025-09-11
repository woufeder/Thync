"use client";

import styles from "@/styles/wishlist.css";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb";
import Sidebar from "@/app/_components/user/sidebar";
import Footer from "@/app/_components/footer";
import ProductCard from "@/app/_components/products/ProductCard";

export default function UserWishListPage() {
  const { user, setUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchWishlist() {
      const token = localStorage.getItem("reactLoginToken");
      const res = await fetch("http://localhost:3007/api/users/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      console.log(result);
      if (result.status === "success") {
        setWishlist(result.data);
      }
      console.log("token:", token);
      console.log("user:", user)
    }
    fetchWishlist();
}, [user]);

  if (!user) return <p>請先登入</p>;

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
            <div className="product-list">
              {wishlist.length === 0 && <p>目前沒有收藏商品</p>}
              {wishlist.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
