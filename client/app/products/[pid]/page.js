"use client";
import { useProduct } from "@/hooks/use-product"
import { use, useEffect } from "react"
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

  // 假設後端回傳 product.images 是一個陣列
  // [{ id: 16, file: "4/1749753181-0.jpg", product_id: 4 }, ...]
  const images = product.images || [];
  const introImages = product.introImages || [];

  {console.log("Product:", product)}


  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumb product={product} />
        <h4>{product.product_name}</h4>

        {/* 圖片區塊 */}
        <div className="d-flex gap-3 flex-wrap mt-3">
          {images.map(img => (
            <img
              key={img.id}
              src={`/images/products/uploads/${img.file}`}
              alt={product.product_name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
            />
          ))}
          {introImages.map(img => (
            <img
              key={img.id}
              src={`/images/products/uploads/${img.file}`}
              alt={product.product_name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
