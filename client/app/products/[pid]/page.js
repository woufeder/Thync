"use client";
import { useProduct } from "@/hooks/use-product"
import { use, useEffect, useState } from "react"
import Breadcrumb from "@/app/_components/breadCrumb"
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";


export default function ProductDetailPage({ params }) {
  const { pid } = use(params); // ← 這裡用 use() unwrap
  const { product, getOne, isLoading } = useProduct();

  useEffect(() => {
    if (pid) getOne(pid);
  }, [pid]);
  if (isLoading) {
    return (
      <div className="container">
        Loading......
      </div>
    );
  }

  if (!product) return <p>沒有找到商品</p>;



  return (
    <>
      <Header />
      <div>
        <Breadcrumb product={product} />
        <h4>{product.product_name}</h4>
      </div>
      <Footer />
    </>
  );
}
