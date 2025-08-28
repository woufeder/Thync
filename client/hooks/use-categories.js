// hooks/use-categories.js
"use client"
import { useState, useEffect } from "react"

export function useCategories() {
  const [categories, setCategories] = useState({ main: [], sub: [], brand: [] })

  useEffect(() => {
    fetch("http://localhost:3007/api/products/categories")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setCategories({ main: data.main, sub: data.sub, brand: data.brand })
        }
      })
      .catch(err => console.error(err))
  }, [])

  return categories
}
