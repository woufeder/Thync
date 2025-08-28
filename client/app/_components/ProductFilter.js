"use client"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 切換母分類
  const handleSelectMain = (mid) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("mid", mid)       // 更新母分類
    params.delete("cid")         // 切母分類時清空子分類
    router.push(`/products?${params.toString()}`)
  }

  // 切換子分類
  const handleSelectSub = (cid) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("cid", cid)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div>
      <button onClick={() => handleSelectMain(1)}>鍵盤</button>
      <button onClick={() => handleSelectMain(2)}>滑鼠</button>

      <button onClick={() => handleSelectSub(3)}>機械式鍵盤</button>
      <button onClick={() => handleSelectSub(4)}>薄膜式鍵盤</button>
    </div>
  )
}
