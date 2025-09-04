"use client";
import { useProduct } from "@/hooks/use-product";
import { use, useEffect, useState } from "react";
import Breadcrumb from "@/app/_components/breadCrumb";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Link from "next/link";

export default function ProductDetail({ params }) {
  const { pid } = use(params);
  const { product, getOne, isLoading } = useProduct();
  const [hasFetched, setHasFetched] = useState(false);
  console.log(product)

  useEffect(() => {
    if (pid) {
      getOne(pid).finally(() => setHasFetched(true));
    }
  }, [pid]);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  if (hasFetched && product === null) {
    return <p>沒有找到商品</p>;
  }

  if (!product) {
    // 初始 render 阻擋掉，避免「閃沒有商品」
    return null;
  }

  const images = product.images || [];
  const introImages = product.introImages || [];

  return (
    <>
      <Header />
      <main className="container">
        <Breadcrumb product={product} />
        <div className="area1">
          <div className="product-images">
            {images.map((img) => (
              <img
                key={img.id}
                src={`/images/products/uploads/${img.file}`}
                alt={product.product_name}
                style={{ width: "200px", height: "auto", objectFit: "cover" }}
              />
            ))}
          </div>
          <div className="product-info">
            <Link href={`/products?brand_id=${product.brand_id}`}>
              <p>{product.brand_name}</p>
            </Link>
            <h5>{product.product_name}</h5>
            <p>價格: ${product.price}</p>
            <p>庫存: {product.stock}</p>
            <p>商品描述: {product.description}</p>
          </div>
        </div>














        <h4>{product.product_name}</h4>
        <div className="d-flex gap-3 flex-wrap mt-3">
          {images.map((img) => (
            <img
              key={img.id}
              src={`/images/products/uploads/${img.file}`}
              alt={product.product_name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
            />
          ))}
          {introImages.map((img) => (
            <img
              key={img.id}
              src={`/images/products/uploads/${img.file}`}
              alt={product.product_name}
              style={{ width: "200px", height: "auto", objectFit: "cover" }}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
