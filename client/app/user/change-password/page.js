"use client";

import styles from "@/styles/change-password.css";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb";
import Sidebar from "@/app/_components/user/sidebar";
import Footer from "@/app/_components/footer";

export default function ResetPasswordPage() {
  const { user, setUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 處理變更密碼
  const handleChangePassword = async () => {
    // 前端驗證
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("請填寫所有欄位");
      return;
    }

    // 檢查新密碼和舊密碼是否相同
    if (newPassword === oldPassword) {
      alert("新密碼不能與舊密碼相同");
      return;
    }

    // 檢查新密碼和確認密碼是否相同
    if (newPassword !== confirmPassword) {
      alert("新密碼與確認密碼不一致");
      return;
    }

    setIsLoading(true);

    try {
      // 🔥 修正：使用正確的 localStorage key
      const token = localStorage.getItem("reactLoginToken"); // 改為與 useAuth 一致的 key

      console.log("取得的 token:", token);
      console.log("Token 類型:", typeof token);

      // 檢查 token 是否存在
      if (!token) {
        alert("請先登入");
        return;
      }

      // 檢查 token 格式 - JWT token 通常有三個部分，用 . 分隔
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        console.error("Token 格式錯誤:", token);
        alert("登入狀態異常，請重新登入");
        return;
      }

      const response = await fetch(
        "http://localhost:3007/api/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const result = await response.json();
      console.log("API 回應:", result);

      if (result.success) {
        alert("密碼變更成功");
        // 清空表單
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        window.location.href = "/user/edit";
      } else {
        alert(result.message || "密碼變更失敗");
      }
    } catch (error) {
      console.error("變更密碼錯誤:", error);
      alert("系統錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

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

            <div id="profile-form" className="form-middle">
              <h1 className="mb-0">會員資料管理</h1>
              <form id="change-password-form" autoComplete="on">
                {/* 舊密碼 */}
                <div className="field">
                  <label htmlFor="old-password" className="label">
                    舊密碼
                  </label>
                  <div className="password-block">
                    <input
                      id="old-password"
                      name="old-password"
                      type={showPassword ? "text" : "password"}
                      className="input"
                      placeholder="請輸入舊密碼"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <i
                      className={
                        showPassword
                          ? "fa-solid fa-eye"
                          : "fa-solid fa-eye-slash"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    ></i>
                  </div>
                </div>

                {/* 新密碼 */}
                <div className="field">
                  <label htmlFor="new-password" className="label">
                    新密碼
                  </label>
                  <div className="password-block">
                    <input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      className="input"
                      placeholder="請輸入新密碼"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <i
                      className={
                        showPassword
                          ? "fa-solid fa-eye"
                          : "fa-solid fa-eye-slash"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    ></i>
                  </div>
                </div>

                {/* 確認密碼 */}
                <div className="field">
                  <label htmlFor="confirm-password" className="label">
                    確認密碼
                  </label>
                  <div className="password-block">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      className="input"
                      placeholder="請再次輸入新密碼"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <i
                      className={
                        showPassword
                          ? "fa-solid fa-eye"
                          : "fa-solid fa-eye-slash"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    ></i>
                  </div>
                </div>

                {/* 按鈕 */}
                <div className="d-flex gap-3 align-items-center">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        &nbsp;&nbsp;處理中...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-key"></i>
                        &nbsp;&nbsp;變更密碼
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
