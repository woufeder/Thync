"use client"

import Image from "next/image";
import Link from "next/link";

export default function ProductSelect({ categories, filteredSubs, mid, cid, brand, search, setSearch, handleMainChange, handleSubChange, handleBrandChange, handleSearch }) {

  return (
    <>
      {/* 母分類 */}
      <select value={mid} onChange={handleMainChange}>
        <option value="">-- 全部母分類 --</option>
        {categories.main.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 子分類 */}
      <select value={cid} onChange={handleSubChange}>
        <option value="">-- 全部子分類 --</option>
        {filteredSubs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* 品牌 */}
      <select value={brand} onChange={handleBrandChange}>
        <option value="">-- 全部品牌 --</option>
        {categories.brand.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* 搜尋 */}
      <input
        type="text"
        placeholder="搜尋關鍵字"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>搜尋</button>
    </>
  )
}