"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useProduct } from "@/hooks/use-product"
import { useEffect, useState } from "react"
import Breadcrumb from "@/app/_components/breadCrumb"
import Header from "@/app/_components/header"
import Footer from "@/app/_components/footer"
import Sidebar from "@/app/_components/products/Sidebar"
import Link from "next/link"

export default function SalePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, list, isLoading } = useProduct()

  // 品牌
  const [categories, setCategories] = useState({ brand: [] })
  const [brands, setBrands] = useState([])

  // 屬性
  const [attributes, setAttributes] = useState([])
  const [options, setOptions] = useState([])

  // 預設抓品牌
  useEffect(() => {
    const brandParam = searchParams.get("brand_id")
    if (brandParam) {
      setBrands(brandParam.split(","))   // "1,2,3" → ["1","2","3"]
    } else {
      setBrands([])
    }
  }, [searchParams])

  // 抓品牌清單
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("http://localhost:3007/api/products/categories")
      const result = await res.json()
      if (result.status === "success") {
        setCategories({ brand: result.brand })
      }
    }
    fetchCategories()
  }, [])

  // 抓屬性清單
  useEffect(() => {
    async function fetchAttributes() {
      const res = await fetch("http://localhost:3007/api/products/attributes")
      const result = await res.json()
      if (result.status === "success") {
        const attrs = result.attributes.map(attr => ({
          ...attr,
          options: result.options.filter(opt => opt.attribute_id === attr.id)
        }))
        setAttributes(attrs)
      }
    }
    fetchAttributes()
  }, [])

  // 首次進頁 → 固定跑 0–500
  useEffect(() => {
    list("?price_min=0&price_max=500")
  }, [])

  // 品牌勾選
const handleBrandChange = (e) => {
  const value = e.target.value
  let newBrands = []

  if (e.target.checked) {
    newBrands = [...brands, value]
  } else {
    newBrands = brands.filter(id => id !== value)
  }
  setBrands(newBrands)

  // 不更新 URL，直接打 API
  let query = `?price_min=0&price_max=500`
  if (newBrands.length > 0) {
    query += `&brand_id=${newBrands.join(",")}`
  }
  if (options.length > 0) {
    query += `&options=${options.join(",")}`
  }
  list(query)
}

// 屬性勾選
const handleOptionChange = (e) => {
  const value = e.target.value
  let newOptions = []

  if (e.target.checked) {
    newOptions = [...options, value]
  } else {
    newOptions = options.filter(id => id !== value)
  }
  setOptions(newOptions)

  // 不更新 URL，直接打 API
  let query = `?price_min=0&price_max=500`
  if (brands.length > 0) {
    query += `&brand_id=${brands.join(",")}`
  }
  if (newOptions.length > 0) {
    query += `&options=${newOptions.join(",")}`
  }
  list(query)
}


  if (isLoading) {
    return <div className="loader container"></div>
  }

  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumb />

        <div className="sidebar">
          {/* 品牌 */}
          <div>
            <strong>品牌</strong>
            {categories.brand.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  value={c.id}
                  checked={brands.includes(String(c.id))}
                  onChange={handleBrandChange}
                />
                {c.name}
              </label>
            ))}
          </div>

          {/* 屬性 */}
          <div>
            {attributes.map(attr => (
              <div key={attr.id}>
                <strong>{attr.name}</strong>
                {attr.options.map(opt => (
                  <label key={opt.id}>
                    <input
                      type="checkbox"
                      value={opt.id}
                      checked={options.includes(String(opt.id))}
                      onChange={handleOptionChange}
                    />
                    {opt.value}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>


        <div>
          {products.length === 0 ? (
            <p>這個價格區間沒有商品，請重新篩選 🔍</p>
          ) : (
            <ul>
              {products.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <li>
                    {p.name} - ${p.price}
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
