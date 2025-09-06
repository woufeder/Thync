"use client"
import { useSearchParams, useRouter } from "next/navigation"

import { useProduct } from "@/hooks/use-product"
import { useEffect, useState } from "react"
import Breadcrumb from "@/app/_components/breadCrumb"
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Sidebar from "@/app/_components/products/Sidebar";
import Link from "next/link"

export default function ProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, list, isLoading } = useProduct()
  const [categories, setCategories] = useState({ main: [], sub: [], brand: [] })
  // 屬性（包含 options）
  const [attributes, setAttributes] = useState([])
  // 使用者勾選的 options id
  const [options, setOptions] = useState([])
  // 價格範圍
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")

  // 從 URL 讀取條件
  const mid = searchParams.get("mid") || ""
  const cid = searchParams.get("cid") || ""
  const [brands, setBrands] = useState([])


  useEffect(() => {
    const brandParam = searchParams.get("brand_id")
    if (brandParam) {
      setBrands(brandParam.split(","))   // "1,2,3" → ["1","2","3"]
    } else {
      setBrands([])
    }
  }, [searchParams])

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

  // 抓取產品屬性
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


  // URL 變動時，自動打 API
  useEffect(() => {
    list("?" + searchParams.toString())
  }, [searchParams])

  // 母分類改變時 → 更新 URL (並清掉子分類)
  const MainChange = (e) => {
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
  const SubChange = (e) => {
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
  const BrandChange = (e) => {
    const value = e.target.value
    let newBrands = []

    if (e.target.checked) {
      newBrands = [...brands, value]
    } else {
      newBrands = brands.filter(id => id !== value)
    }

    setBrands(newBrands)

    // 更新 URL
    const params = new URLSearchParams(searchParams.toString())
    if (newBrands.length > 0) {
      params.set("brand_id", newBrands.join(","))
    } else {
      params.delete("brand_id")
    }
    router.push(`/products?${params.toString()}`)
  }

  // 價格篩選
  const PriceChange = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceMin) {
      params.set("price_min", priceMin)
    } else {
      params.delete("price_min")
    }

    if (priceMax) {
      params.set("price_max", priceMax)
    } else {
      params.delete("price_max")
    }

    router.push(`/products?${params.toString()}`)
  }


  const filteredSubs = categories.sub.filter((s) => s.main_id == mid)

  if (isLoading) {

    return (
      <div className="container">
        Loading......
      </div>
    );
  }

  const filteredAttrs = mid
    ? attributes.filter(attr => String(attr.main_id) === mid)
    : attributes

  // 屬性選項勾選 (多選 AND)
  const OptionChange = (e) => {
    const value = e.target.value
    let newOptions = []
    if (e.target.checked) {
      newOptions = [...options, value]
    } else {
      newOptions = options.filter(id => id !== value)
    }
    setOptions(newOptions)

    const params = new URLSearchParams(searchParams.toString())
    if (newOptions.length > 0) {
      params.set("options", newOptions.join(","))
    } else {
      params.delete("options")
    }
    router.push(`/products?${params.toString()}`)
  }

  // 清空屬性和價格
  const ClearFilters = () => {
    setOptions([])
    setPriceMin("")
    setPriceMax("")
    setBrands([])   // 如果也要清掉品牌記得加這行

    router.replace("/products")
  }

  return (
    <>
      <Header />
      <div className="container p-page">
        <Sidebar
          categories={categories}
          filteredSubs={filteredSubs}
          filteredAttrs={filteredAttrs}
          mid={mid}
          cid={cid}
          brands={brands}
          options={options}
          setOptions={setOptions}
          priceMin={priceMin}
          priceMax={priceMax}
          setPriceMin={setPriceMin}
          setPriceMax={setPriceMax}
          MainChange={MainChange}
          SubChange={SubChange}
          BrandChange={BrandChange}
          OptionChange={OptionChange}
          PriceChange={PriceChange}
          ClearFilters={ClearFilters}
        />
        <main>
          <Breadcrumb />
          <div>
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="card">
                  <img
                    src={
                      p.first_image
                        ? `/images/products/uploads/${p.first_image}`
                        : "/images/no-image.png"
                    }
                    alt={p.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <p>{p.name}</p>
                    <p>${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
