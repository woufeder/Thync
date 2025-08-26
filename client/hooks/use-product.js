"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ProductContext = createContext(null)
ProductContext.displayName = "ProductContext"

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
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

  return (
    <ProductContext.Provider value={{ products, list, isLoading }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => useContext(ProductContext)