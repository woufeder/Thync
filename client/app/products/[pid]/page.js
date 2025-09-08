"use client";
import style from '@/styles/products.css'
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
  const [mainImg, setMainImg] = useState(""); // 新增主圖 state
  const [qty, setQty] = useState(1);
  console.log(product)

  useEffect(() => {
    if (pid) {
      getOne(pid).finally(() => setHasFetched(true));
    }
  }, [pid]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImg(product.images[0].file); // 預設第一張為主圖
    }
  }, [product]);

  if (isLoading) {
    return <div className="loader container"></div>
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

  function handleAddToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const exist = cart.find(i => i.id === product.id);
    let newCart;
    if (exist) {
      newCart = cart.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + qty } : i
      );
    } else {
      newCart = [...cart, { ...product, qty }];
    }
    
  localStorage.setItem("cartItems", JSON.stringify(newCart));
  console.log("getItem", localStorage.getItem("cartItems"));
    alert("已加入購物車");
  }

  return (
    <>
      <Header />
      <main className="container">
        <Breadcrumb product={product} />
        <div className="area1">
          <div className="product-images">
            {/* 主圖 */}
            <div className="main-image">
              {mainImg && (
                <img
                  src={`/images/products/uploads/${mainImg}`}
                  alt={product.product_name}
                />
              )}
            </div>
            {/* 縮圖列 */}
            <div
              className="thumbnails"
              style={{}}
            >
              {images.map((img) => (
                <img
                  key={img.id}
                  src={`/images/products/uploads/${img.file}`}
                  alt={product.product_name}
                  onClick={() => setMainImg(img.file)}
                  className={mainImg === img.file ? "active" : ""}
                />
              ))}
            </div>
          </div>
          <div className="product-info">
            <Link href={`/products?brand_id=${product.brand_id}`}
              className='brand-link'>
              <p>{product.brand_name}</p>
            </Link>
            <h5>{product.product_name}</h5>
            <p>商品型號：{product.model}</p>
            <h5>${product.price}</h5>
            <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
            <span>{qty}</span>
            <button onClick={() => setQty(q => q + 1)}>+</button>
            <button onClick={() => handleAddToCart(product)}>加入購物車</button>
            <p>數量</p>
            <button className="btn btn-primary">加入購物車</button>
            <button className="btn btn-primary">直接結帳</button>
            <button className="btn btn-primary">關注商品</button>

          </div>
        </div>

        <div className='area2'>
          <p>商品介紹 {product.intro}</p>
          <p>商品規格 {product.spec}</p>
        </div>









        <div className="d-flex gap-3 flex-wrap mt-3">

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
