"use client"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'



export default function Breadcrumb({ product }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState({ main: [], sub: [], brand: [] })

  // 抓分類清單（只抓一次）
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

  const mid = searchParams.get("mid")
  const cid = searchParams.get("cid")
  const mainName = categories.main.find(m => m.id === Number(mid))?.name
  const subName = categories.sub.find(s => s.id === Number(cid))?.name

  let items = [{ label: "首頁", href: "/" }]

  // 商品頁
  if (pathname === "/products") {
    items.push({ label: "所有商品", href: "/products" })
    if (mid && mainName) items.push({ label: mainName, href: `/products?mid=${mid}` })
    if (cid && subName) items.push({ label: subName, href: `/products?mid=${mid}&cid=${cid}` })
  }

  if (pathname.startsWith("/products/") && product) {
    items.push({ label: "所有商品", href: "/products" })
    items.push({ label: product.main_name, href: `/products?mid=${product.main_id}` })
    items.push({ label: product.sub_name, href: `/products?mid=${product.main_id}&cid=${product.sub_id}` })
    items.push({ label: product.product_name, href: `/products/${product.id}` })
  }

  // 會員頁
  if (pathname.startsWith("/member")) {
    items.push({ label: "會員中心", href: "/member" })
    if (pathname.includes("profile")) items.push({ label: "個人資料" })
    if (pathname.includes("orders")) items.push({ label: "我的訂單" })
    if (pathname.includes("password")) items.push({ label: "修改密碼" })
  }

  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
    <FontAwesomeIcon icon={faHouse} />
      <ol>
        {items.map((item, idx) => (
          <li key={idx}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            {idx < items.length - 1 && <span>
             <FontAwesomeIcon icon={faAngleRight} />
             </span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
