"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useProduct } from "@/hooks/use-product"
import { useEffect, useState } from "react"
import Breadcrumb from "@/app/_components/breadCrumb"

export default function ProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, list, isLoading } = useProduct()
  const [categories, setCategories] = useState({ main: [], sub: [], brand: [] })

  // 從 URL 讀取條件
  const mid = searchParams.get("mid") || ""
  const cid = searchParams.get("cid") || ""
  const brand = searchParams.get("brand_id") || ""
  const keyword = searchParams.get("search") || ""

  // 抓分類清單
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("http://localhost:3007/api/products/categories")
      const result = await res.json()
      if (result.status === "success") {
        setCategories({
          main: result.main,
          sub: result.sub,
          brand: result.brand
        })
      }
    }
    fetchCategories()
  }, [])

  // URL 變動時，自動打 API
  useEffect(() => {
    list("?" + searchParams.toString())
  }, [searchParams])

  // 母分類改變時 → 更新 URL (並清掉子分類)
  const handleMainChange = (e) => {
    const params = new URLSearchParams(searchParams.toString())
    const value = e.target.value
    if (value) {
      params.set("mid", value)
      params.delete("cid")
    } else {
      params.delete("mid")
      params.delete("cid")
    }
    router.push(`/products?${params.toString()}`)
  }

  // 子分類
  const handleSubChange = (e) => {
    const params = new URLSearchParams(searchParams.toString())
    const value = e.target.value
    if (value) {
      params.set("cid", value)
    } else {
      params.delete("cid")
    }
    router.push(`/products?${params.toString()}`)
  }

  // 品牌
  const handleBrandChange = (e) => {
    const params = new URLSearchParams(searchParams.toString())
    const value = e.target.value
    if (value) {
      params.set("brand_id", value)
    } else {
      params.delete("brand_id")
    }
    router.push(`/products?${params.toString()}`)
  }

  // 搜尋
  const [search, setSearch] = useState(keyword)
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    router.push(`/products?${params.toString()}`)
  }

  const filteredSubs = categories.sub.filter((s) => s.main_id == mid)

  return (
    <div>
      <h1>商品列表</h1>
      <Breadcrumb />

      {/* 母分類 */}
      <select value={mid} onChange={handleMainChange}>
        <option value="">-- 全部母分類 --</option>
        {categories.main.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 子分類 */}
      <select value={cid} onChange={handleSubChange}>
        <option value="">-- 全部子分類 --</option>
        {filteredSubs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 品牌 */}
      <select value={brand} onChange={handleBrandChange}>
        <option value="">-- 全部品牌 --</option>
        {categories.brand.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 搜尋 */}
      <input
        type="text"
        placeholder="搜尋關鍵字"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>搜尋</button>

      {isLoading && <p>載入中...</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
