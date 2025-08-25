"use client"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function Footer() {

  return (
    <>
      <div className="row">
        <div className="col">
          <h5>
            商品
          </h5>
          <a href="#">鍵盤｜鍵帽｜鍵盤周邊</a>
          <a href="#">滑鼠｜鼠墊｜滑鼠周邊</a>
          <a href="#">耳機｜喇叭｜音訊設備</a>
          <a href="#">機殼｜電源｜散熱設備</a>
          <a href="#">螢幕｜視訊｜相關設備</a>
        </div>
        <div className="col">
          <h5>
            關於Thync
          </h5>
          <a href="#">關於我們</a>
          <a href="#">活動消息</a>
          <a href="#">隱私政策</a>
          <a href="#">保固範圍</a>
          <a href="#">聯絡我們</a>
        </div>
        <div className="col">
          <h5>
            社群資訊
          </h5>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Line</a>
        </div>
      </div>
      <div className="copyright">
        <p>© 2025 Thync. All Rights Reserved.</p>
      </div>
    </>
  );
}