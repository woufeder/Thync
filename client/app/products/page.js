"use client"
import { useProduct } from "@/hooks/use-product";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const { products, list, isLoading } = useProduct()
  const [categories, setCategories] = useState({ main: [], sub: [], brand: [] })
  const [mid, setMid] = useState("")
  const [cid, setCid] = useState("")
  const [brand, setBrand] = useState("")

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


  // 母分類改變時，重置子分類
  const handleMainChange = (e) => {
    setMid(e.target.value)
    setCid("") // 清空子分類選擇
  }

  const filteredSubs = categories.sub.filter((s) => s.main_id == mid)

  // 點擊搜尋
  const handleSearch = () => {
    let query = "?"
    if (mid) query += `mid=${mid}&`
    if (cid) query += `cid=${cid}&`
    if (brand) query += `brand_id=${brand}&`
    list(query)
  }

  return (
    <div>
      <h1>商品列表</h1>
      
      {/* 母分類 */}
      <select value={mid} onChange={handleMainChange}>
        <option value="">-- 全部母分類 --</option>
        {categories.main.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 子分類（根據母分類過濾） */}
      <select value={cid} onChange={(e) => setCid(e.target.value)} >
        <option value="">-- 全部子分類 --</option>
        {filteredSubs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 品牌 */}
      <select value={brand} onChange={(e) => setBrand(e.target.value)}>
        <option value="">-- 全部品牌 --</option>
        {categories.brand.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

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

