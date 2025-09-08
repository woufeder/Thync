"use client";
import style from '@/styles/products.css'
import { useProduct } from "@/hooks/use-product";
import { use, useEffect, useState } from "react";
import Breadcrumb from "@/app/_components/breadCrumb";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCashRegister, faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons"

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
            {/* 主圖 */}
            <div className="main-image">
              {mainImg && (
                <img
                  src={`/images/products/uploads/${mainImg}`}
                  alt={product.product_name}
                />
              )}
            </div>

          </div>
          <div className="product-info">
            <div className='d-flex align-items-center justify-content-between gap-3 mb-2'>
              <Link href={`/products?brand_id=${product.brand_id}`}
                className='brand-link text-decoration-none'>
                <h5 className='brand-name'>{product.brand_name}</h5>
              </Link>
              <p className='product-model'>商品型號：{product.model}</p>
            </div>

            <h5>{product.product_name}</h5>

            <div className='price'>${product.price}</div>

            <div className='d-flex align-items-center gap-2 mb-3'>
              <p className='mb-0 me-2'>數量</p>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className='btn btn-outline-secondary qtyBtn'><FontAwesomeIcon icon={faMinus} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className='btn btn-outline-secondary qtyBtn'><FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <div className='d-flex gap-3 flex-wrap'>
              <button onClick={() => handleAddToCart(product)} className='btn btn-primary CartBtn'><FontAwesomeIcon icon={faCartShopping} />　加入購物車</button>
              <button className="btn btn-primary CheckoutBtn"><FontAwesomeIcon icon={faCashRegister} />　直接結帳</button>
              <button className="btn btn-primary FollowBtn"><FontAwesomeIcon icon={faHeart} />　收藏商品</button>
            </div>
          </div>
        </div>







        <ul className="nav nav-tabs">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home"
              type="button" role="tab" aria-controls="home" aria-selected="true">商品介紹</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button"
              role="tab" aria-controls="profile" aria-selected="false">商品規格</button>
          </li>
        </ul>


        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div id="intro" className="mt-2 preserve-format"><pre>商品介紹 {product.intro}</pre></div>
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
            <div>

            </div>
          </div>
          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div id="spec" className=" mt-2 preserve-format"><pre>商品規格 {product.spec}</pre></div>

          </div>
        </div>












      </main>
      <Footer />
    </>
  );
}
