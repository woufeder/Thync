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
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function UserWishListPage() {
  const { user, setUser, isLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;

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
      console.log("user:", user);
    }
    fetchWishlist();
  }, [user]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container">
          <p>載入中...</p>
        </div>
        <Footer />
      </div>
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
            <div className="product-list">
              {wishlist.length === 0 && <p>目前沒有追蹤商品</p>}
              {wishlist.map((p, index) => (
                <div key={p.id} className="product-card">
                  <div
                    className="card-img"
                    style={{ cursor: "pointer" }}
                    onClick={() => (window.location.href = `/products/${p.id}`)}
                  >
                    <img
                      src={
                        p.first_image
                          ? `/images/products/uploads/${p.first_image}`
                          : "/images/no-image.jpg"
                      }
                      alt={p.name}
                    />
                    <button
                      className="btn trash"
                      onClick={async (e) => {
                        e.preventDefault(); // 阻止預設行為
                        e.stopPropagation(); // 阻止事件冒泡

                        if (!confirm("確定要移除此商品的追蹤嗎？")) {
                          return;
                        }

                        try {
                          const token = localStorage.getItem("reactLoginToken");
                          const res = await fetch(
                            `http://localhost:3007/api/users/wishlist/${p.id}`,
                            {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );

                          const result = await res.json();
                          if (result.status === "success") {
                            // 更新狀態而不是重新載入整個頁面
                            setWishlist(
                              wishlist.filter((item) => item.id !== p.id)
                            );
                          } else {
                            alert(result.message || "移除失敗");
                          }
                        } catch (error) {
                          console.error("移除追蹤錯誤:", error);
                          alert("移除失敗，請稍後再試");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div
                      className="card-title"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        (window.location.href = `/products/${p.id}`)
                      }
                    >
                      {p.name}
                    </div>
                    <div className="card-bottom">
                      <p className="price">${p.price}</p>
                      <button
                        className="btn btnCart"
                        onClick={() => {
                          // 統一加入購物車資料結構
                          const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
                          const exist = cart.find((i) => i.id === p.id);
                          const cartProduct = {
                            id: p.id,
                            product_name: p.name || p.product_name || "",
                            price: p.price,
                            images: p.images || (p.first_image ? [{ file: p.first_image }] : []),
                            intro: p.intro || "",
                            introImages: p.introImages || [],
                            brand_id: p.brand_id,
                            brand_name: p.brand_name,
                            model: p.model,
                            qty: 1,
                          };
                          let newCart;
                          if (exist) {
                            newCart = cart.map((i) =>
                              i.id === p.id ? { ...i, qty: i.qty + 1 } : i
                            );
                          } else {
                            newCart = [...cart, cartProduct];
                          }
                          localStorage.setItem("cartItems", JSON.stringify(newCart));
                          alert("已加入購物車");
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
