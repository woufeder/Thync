"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";


export default function ArticleCard() {
    return (
        <div>
            <img src="/images/articleSample.jpg" alt="Article Image" className="image" />
            <div className="content">
                <div className="note">
                    <p className="time">2024-05-01</p>
                    <button className="btn ">機械鍵盤</button>
                </div>
                <h5 className="title">鍵帽的神 GMK 開箱評測</h5>
                <p className="description">本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你
                    找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一
                    次搞懂所有選擇。</p>
                <div className="footer">
                    <div className="admin">
                        <img src="/images/admin.jpg" alt="admin-image" className="avatar" />
                        <p className="name">財神爺小編</p>
                    </div>
                    <a className="btn ">閱讀更多</a>
                </div>
            </div>

        </div>
    )
}