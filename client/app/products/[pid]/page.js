"use client";
import { use,useEffect } from "react";
import Breadcrumb from "@/app/_components/breadCrumb";
import { useProduct } from "@/hooks/use-product";


export default function ProductDetailPage({ params }) {
  const { pid } = use(params); // ← 這裡用 use() unwrap
  const { product, getOne, isLoading } = useProduct();

  useEffect(() => {
    if (pid) getOne(pid);
  }, [pid]);
  if (isLoading) return <p>載入中...</p>;
  if (!product) return <p>沒有找到商品</p>;

  return (
    <div>
      <Breadcrumb product={product} />
      <h1>{product.product_name}</h1>
    </div>
  );
}
