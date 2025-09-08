"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import styles from "@/styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";

export default function UserLoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(true);
  const { login, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const animationRef = useRef(null);

  // 跳轉會員中心
  useEffect(() => {
    if (!isLoading && user) {
      window.location.href = "/user";
    }
  }, [user, router, isLoading]);

  useEffect(() => {
    if (lottieLoaded || window.lottie) {
      initializeLottie();
    }
  }, [lottieLoaded]);

  // Google 登入初始化

  // useEffect(() => {
  //   // 載入 Google Identity Services script

  //   const script = document.createElement("script");

  //   script.src = "https://accounts.google.com/gsi/client";

  //   script.async = true;

  //   script.defer = true;

  //   script.onload = initializeGoogle;

  //   document.head.appendChild(script);

  //   return () => {
  //     // 清理

  //     if (document.head.contains(script)) {
  //       document.head.removeChild(script);
  //     }
  //   };
  // }, []);

  // 在 useEffect 中加入
  useEffect(() => {
    // 檢查 URL 是否包含 Google 回傳的 token
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state");

      if (accessToken && state === "login") {
        handleGoogleToken(accessToken);
      }
    }
  }, []);

  const handleGoogleToken = async (accessToken) => {
    try {
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      const userInfo = await userResponse.json();

      const response = await fetch(
        "http://localhost:3007/api/users/google-login-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            id: userInfo.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (loginWithToken) {
          await loginWithToken(data.data.token, data.data.user);
        } else {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          window.location.href = "/user";
        }
      }
    } catch (error) {
      console.error("處理 Google token 錯誤:", error);
    }
  };

  const initializeGoogle = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
        // 禁用 FedCM
        use_fedcm_for_prompt: false,
      });
      setIsGoogleLoaded(true);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      console.log("Google 回傳的憑證:", response.credential);

      // 將 Google JWT token 發送到後端驗證

      const backendResponse = await fetch(
        "http://localhost:3007/api/users/google-login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      const data = await backendResponse.json();

      console.log("後端回應:", data);

      if (data.success) {
        // 登入成功，使用 useAuth 的 login 方法
        if (login) {
          // 這裡直接傳入 token 和 user
          await login(data.data.token, data.data.user);
          // login 內部已經有 router.replace("/user")
        } else {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          window.location.href = "/user";
        }

        alert("Google 登入成功！");
      } else {
        alert("Google 登入失敗：" + data.message);
      }
    } catch (error) {
      console.error("Google 登入錯誤:", error);

      alert("Google 登入發生錯誤，請稍後再試");
    }
  };

  // const handleGoogleLogin = () => {
  //   if (window.google && isGoogleLoaded) {
  //     // 直接觸發 One Tap 登入
  //     window.google.accounts.id.prompt();
  //   } else {
  //     alert("Google 登入服務尚未載入完成，請稍後再試");
  //   }
  // };

  const handleGoogleLogin = () => {
    // 使用正確的 Google OAuth 2.0 授權端點
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent("http://localhost:3000")}&` +
      `scope=${encodeURIComponent("email profile")}&` +
      `response_type=token&` +
      `state=login`;

    window.location.href = googleAuthUrl;
  };

  const onclick = async () => {
    await login(mail, password);
  };

  // Lottie 動畫初始化
  const initializeLottie = () => {
    if (typeof window !== "undefined" && window.lottie) {
      // 載入 Lottie 動畫
      animationRef.current = window.lottie.loadAnimation({
        // 放置 SVG 的容器
        container: document.querySelector("#lottie-animation"),
        // 使用 SVG 渲染（建立 SVG）
        renderer: "svg",
        loop: true,
        autoplay: true,
        // 動畫的 JSON 檔
        path: "/wave.json", // 注意路徑改為 /wave.json
      });

      // 動畫載入完成後設定遮罩
      animationRef.current.addEventListener("DOMLoaded", function () {
        setupMask();
      });
    }
  };

  const setupMask = () => {
    // Lottie 產生的 <svg>
    const animationSVG = document.querySelector("#lottie-animation svg");
    // 白色遮罩群組
    const maskContent = document.querySelector("#mask-content");
    const backgroundImage = document.querySelector(".background-image");

    if (animationSVG && maskContent) {
      // 深層拷貝動畫
      const clonedContent = animationSVG.cloneNode(true);

      // 清空遮罩
      maskContent.innerHTML = "";
      // 深層拷貝所有子節點到遮罩
      [...clonedContent.children].forEach((child) => {
        maskContent.appendChild(child.cloneNode(true));
      });

      // 使用 Lottie 動畫作為遮罩
      backgroundImage.style.mask = "url(#lottie-mask)";

      // Lottie 每播放一個影格就觸發一次
      animationRef.current.addEventListener("enterFrame", function () {
        updateMask();
      });
    }
  };

  const updateMask = () => {
    const animationSVG = document.querySelector("#lottie-animation svg");
    const maskContent = document.querySelector("#mask-content");

    // 每次更新把目前動畫的 SVG 子節點複製到遮罩
    if (animationSVG && maskContent) {
      maskContent.innerHTML = "";
      [...animationSVG.children].forEach((child) => {
        const cloned = child.cloneNode(true);
        // 確保遮罩元素是白色的
        // 確保遍歷子節點時，不要設定到其中的文字節點、註解節點（沒有 setAttribute 屬性）
        if (cloned.setAttribute) {
          // 強制子節點的 fill、stroke 為白色
          cloned.setAttribute("fill", "white");
          cloned.setAttribute("stroke", "white");
        }
        maskContent.appendChild(cloned);
      });
    }
    if (!animationSVG || !maskContent) return;

    // 取得動畫原始大小
    // 取得 SVG 內部 viewBox 格式 "minX minY width height" 轉陣列
    const viewBox = animationSVG.getAttribute("viewBox");
    if (viewBox) {
      const viewBoxArray = viewBox.split(" ");
      // parseFloat 轉數字
      const animWidth = parseFloat(viewBoxArray[2]);
      const animHeight = parseFloat(viewBoxArray[3]);

      // 取得容器大小
      const container = document.querySelector(".container1");
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // 計算縮放比例，把 SVG 動畫剛好填滿容器
        const scaleX = containerWidth / animWidth;
        const scaleY = containerHeight / animHeight;

        // 設置縮放使遮罩填滿容器
        maskContent.setAttribute(
          "transform",
          `scale(${scaleX}, ${scaleY}) translate(-200, 0)`
        );
      }
    }
  };

  // 清理動畫資源
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, []);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  return (
    <div>
      {/* 載入 Lottie 腳本 */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setLottieLoaded(true);
          initializeLottie();
        }}
      />

      <div className="container1">
        <div className="left">
          <div className="block1">
            <div className="header">
              <div className="d-flex align-items-center justify-content-between">
                <img src="/images/LOGO.png" alt="LOGO" />
                <Link href="/" className="home-link" aria-label="回到首頁">
                  <FontAwesomeIcon
                    icon={faHouseChimney}
                    className="home-icon"
                  />
                </Link>
              </div>

              <h1 className="register-title">會員登入</h1>
              <div className="toggle">
                <Link href="/user/login" className="toggle-active">
                  登入
                </Link>
                <Link href="/user/add" className="toggle-link">
                  註冊
                </Link>
              </div>
            </div>
            <main>
              <form
                id="login-form"
                autoComplete="on"
                onSubmit={(e) => {
                  e.preventDefault();
                  onclick();
                }}
              >
                {/* 信箱 */}
                <div className="field">
                  <label htmlFor="mail" className="label">
                    信箱
                  </label>
                  <input
                    id="mail"
                    name="mail"
                    type="email"
                    className="input"
                    autoComplete="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </div>

                {/* 密碼 */}
                <div className="field">
                  <label htmlFor="password" className="label">
                    密碼
                  </label>
                  <div className="password-block">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <a href="/user/forgot-password" className="link forget">
                  忘記密碼
                </a>

                {/* 按鈕 */}
                <button className="btn-primary" type="submit">
                  <i className="fa-solid fa-right-to-bracket"></i>
                  &nbsp;登入
                </button>

                <div className="divider">或</div>

                <div className="d-flex align-items-center justify-content-between">
                  <p className="signin">
                    還不是會員？{" "}
                    <a href="/user/add" className="link2">
                      立即註冊！
                    </a>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-google"
                  onClick={handleGoogleLogin}
                  disabled={!isGoogleLoaded}
                >
                  <img src="/images/users/Google Logo.png" alt="" />

                  <span>
                    {isGoogleLoaded
                      ? "使用 Google 帳號登入"
                      : "載入 Google 登入中..."}
                  </span>
                </button>
              </form>
            </main>
          </div>
        </div>

        <div className="hidden">
          {/* 背景圖片 */}
          <div className="background-image"></div>

          {/* 隱藏的 SVG 用於遮罩定義 */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              {/* 定義遮罩規則：白色=顯示、黑色=隱藏、灰色=半透明 */}
              <mask id="lottie-mask">
                {/* 先把整塊變黑 */}
                <rect width="100%" height="100%" fill="black" />
                {/* 拷貝 Lottie SVG 內容產生圖形，變成白色區塊 */}
                <g id="mask-content" fill="white" transform="scale(-1,1)"></g>
              </mask>
            </defs>
          </svg>

          {/* 隱藏的 Lottie 動畫 */}
          <div className="lottie-mask" id="lottie-animation"></div>
        </div>
      </div>

      <div className="round"></div>
    </div>
  );
}
