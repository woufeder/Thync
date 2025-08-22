"use client"

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function UserAddPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  // router.replace("/user/login")


  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/user/login")// 導頁，當Laoding結束且沒有使用者時，切換到登入頁
    }
  }, [user, isLoading])


  if (isLoading || !user) return null


  return (
    <div className="container py-3">
    <h1>增加使用者</h1>
    <Link className="btn btn-primary" href="/">回首頁</Link>
    </div>
  )
}