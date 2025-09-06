"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext(null)
ProductContext.displayName = "ProductContext"

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState(null)   // ← 新增：單一商品
  const [isLoading, setIsLoading] = useState(true)

  // 取得商品列表
  const list = async (query = "") => {
    const API = `http://localhost:3007/api/products${query}`
    try {
      const res = await fetch(API)
      const result = await res.json()
      if (result.status === "success") {
        setProducts(result.data)
      }
      setIsLoading(false)
    } catch (error) {
      setProducts([])
      setIsLoading(false)
      alert(error.message)
    }
  }

  // 預設自動載入全部商品
  useEffect(() => {
    list()
  }, [])


  // 抓單一商品
  const getOne = async (id) => {
    const API = `http://localhost:3007/api/products/${id}`
    try {
      setIsLoading(true)
      const res = await fetch(API)
      const result = await res.json()
      if (result.status === "success") {
        setProduct(result.data)   // ← 這裡直接塞單一商品
      } else {
        setProduct(null)
      }
    } catch (error) {
      setProduct(null)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProductContext.Provider value={{ products, list, isLoading, product, getOne }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => useContext(ProductContext)