import { useEffect, useState } from "react";

export function useProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 這裡可以改成你的 API 路徑
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return { products, setProducts };
}