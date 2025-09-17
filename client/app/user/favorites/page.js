"use client";

import "@/styles/wishlist.css";
import "@/styles/articles.css";
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
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UserFavoritesPage() {
  const { user, setUser, isLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;

      const token = localStorage.getItem("reactLoginToken");
      const res = await fetch("http://localhost:3007/api/users/favorites", {
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
            <div className="a-cards">
              <div className="row userfavorites">
                {wishlist.map((article) => (
                  <div
                    key={article.id}
                    className="col"
                    style={{ position: "relative" }}
                  >
                    <button
                      className="btn trash"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!confirm("確定要移除此文章的收藏嗎？")) {
                          return;
                        }

                        try {
                          const token = localStorage.getItem("reactLoginToken");
                          const res = await fetch(
                            `http://localhost:3007/api/users/favorites/${article.id}`,
                            {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );

                          const result = await res.json();
                          if (result.status === "success") {
                            setWishlist(
                              wishlist.filter((item) => item.id !== article.id) 
                            );
                          } else {
                            alert(result.message || "移除失敗");
                          }
                        } catch (error) {
                          console.error("移除收藏錯誤:", error);
                          alert("移除失敗，請稍後再試");
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <Link
                      key={article.id}
                      href={`/articles/${article.id}`}
                      className="article-card-link"
                    >
                      <div>
                        <img
                          src={
                            article.cover_image
                              ? `/images/articles/${article.cover_image}`
                              : "/images/articleSample.jpg"
                          }
                          alt={article.title}
                          className="image"
                          onError={(e) => {
                            e.target.src = "/images/articleSample.jpg";
                          }}
                        />
                        <div className="content">
                          <div className="note">
                            <p className="time">{article.created_at}</p>
                            <button
                              className="btn "
                              onClick={(e) => e.preventDefault()}
                            >
                              {article.category_name || "未分類"}
                            </button>
                          </div>
                          <h5 className="title">{article.title}</h5>
                          {/* <p className="description">
                          {article.content
                            ? article.content.substring(0, 150) + "..."
                            : "暫無內容"}
                        </p> */}
                          {/* <div className="footer">
                          <div className="admin">
                            <img
                              src="/images/admin.jpg"
                              alt="admin-image"
                              className="avatar"
                            />
                            <p className="name">財神爺小編</p>
                          </div>
                          <span className="btn ">閱讀更多</span>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
