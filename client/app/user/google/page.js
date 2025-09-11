"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SimpleGoogleLogin() {
  const { loginWithToken, user, isLoading } = useAuth();
  const router = useRouter();

  // 跳轉會員中心
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/user");
    }
  }, [user, isLoading, router]);

  // 處理 Google 登入回傳
  useEffect(() => {
    // 檢查 URL 是否有 Google 回傳的 token
    const hash = window.location.hash;
    console.log("當前 URL hash:", hash);

    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state");

      console.log("找到 access_token:", accessToken);
      console.log("state:", state);

      if (accessToken && state === "google_login") {
        handleGoogleCallback(accessToken);
      }
    }
  }, []);

  const handleGoogleCallback = async (accessToken) => {
    try {
      console.log("=== 開始處理 Google 回傳 ===");

      // 1. 用 access_token 取得使用者資訊
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      const userInfo = await userResponse.json();
      console.log("Google 使用者資訊:", userInfo);

      // 2. 發送到我們的後端
      const response = await fetch(
        "http://localhost:3007/api/users/google-login-simple",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.id,
          }),
        }
      );

      const data = await response.json();
      console.log("後端回應:", data);

      if (data.success) {
        console.log("準備呼叫 loginWithToken");
        await loginWithToken(data.data.token, data.data.user);
        alert("Google 登入成功！");

        // 清除 URL hash
        window.location.hash = "";
        setTimeout(() => {
          window.location.href = "/user";
        }, 300);
      } else {
        alert("登入失敗：" + data.message);
      }
    } catch (error) {
      console.error("Google 登入錯誤:", error);
      alert("登入過程發生錯誤");
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:3000/user/google";

    console.log("Client ID:", clientId);
    console.log("Redirect URI:", redirectUri);
    console.log("當前頁面 URL:", window.location.href);

    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("scope", "email profile");
    googleAuthUrl.searchParams.set("response_type", "token");
    googleAuthUrl.searchParams.set("state", "google_login");

    console.log("完整 Google Auth URL:", googleAuthUrl.toString());
    window.location.href = googleAuthUrl.toString();
  };

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>簡化版 Google 登入測試</h1>

      {user ? (
        <div>
          <p>已登入：{user.name || user.mail}</p>
          <button onClick={() => router.push("/user")}>前往會員中心</button>
        </div>
      ) : (
        <div>
          <p>請登入</p>
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            使用 Google 登入
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>除錯資訊：</p>
        <p>
          當前 URL:{" "}
          {typeof window !== "undefined" ? window.location.href : "N/A"}
        </p>
        <p>User 狀態: {user ? "已登入" : "未登入"}</p>
        <p>Loading 狀態: {isLoading ? "true" : "false"}</p>
      </div>
    </div>
  );
}
