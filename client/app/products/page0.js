"use client";

import { useProduct } from "@/hooks/use-product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Header from "../_components/header";

export default function UserPage() {
  const { list, products } = useProduct();
  const [mid, setMid] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setMid(value)

    if (value) {
      list(`?mid=${value}`)   // 有選分類 → 加上 mid
    } else {
      list()                  // 沒選 → 抓全部
    }
  }

  console.log(products);

  return (
    <div className="container py-3">
      <Header />
      
      <h1>商品列表頁</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">商品名稱</th>
            <th scope="col">母分類</th>
            <th scope="col">子分類</th>
            <th scope="col">品牌</th>
            <th scope="col">品名</th>
            <th scope="col">價格</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={`product${index}`}>
              <th scope="row">{index + 1}</th>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <Link href={`/user/${product.account}`}>
                </Link>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      {/* <div className="btn btn-primary me-1" onClick={list}>取得使用者列表</div> */}
      <Link className="btn btn-primary" href="/user">
        回首頁
      </Link>
    </div>
  );
}
