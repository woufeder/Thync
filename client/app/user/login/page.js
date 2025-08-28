"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import styles from "@/styles/login.css";

export default function UserLoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const onclick = () => {
    console.log("Mail:", mail, "Password:", password);
    login(mail, password);
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
            <header>
              <img src="/images/users/LOGO_3.png" alt="" />
              <h1 className="register-title">會員登入</h1>
              <div className="toggle">
                <a href="#" className="toggle-active">
                  登入
                </a>
                <a href="#" className="toggle-link">
                  註冊
                </a>
              </div>
            </header>
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
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <i className="fa-solid fa-eye-slash"></i>
                  </div>
                </div>

                <a href="#" className="link forget">
                  忘記密碼
                </a>

                {/* 按鈕 */}
                <button className="btn-primary" type="submit">
                  <i className="fa-solid fa-right-to-bracket"></i>
                  &nbsp;登入
                </button>

                <div className="divider">或</div>

                <p className="signin">
                  還不是會員？{" "}
                  <a href="#" className="link2">
                    立即註冊！
                  </a>
                </p>

                <button type="button" className="btn-google">
                  <img src="/images/users/Google Logo.png" alt="" />
                  <span>使用 Google 帳號登入</span>
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
