"use client"

import style from '@/styles/products.css'
import { useState,useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"



export default function Sidebar({
  categories,
  filteredSubs,
  filteredAttrs,
  mid,
  cid,
  brands,
  options,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  MainChange,
  SubChange,
  BrandChange,
  OptionChange,
  PriceChange,
  ClearFilters   // ⭐ 新增
}) {

  const [openMain, setOpenMain] = useState(null)
  const [brandExpanded, setBrandExpanded] = useState(false)

  const toggleMain = (id) => {
    setOpenMain(openMain === id ? null : id) // 如果點同一個就收合
    MainChange({ target: { value: id } }) // 順便篩選
  }

  useEffect(() => {
    if (mid) {
      setOpenMain(Number(mid))  // 根據網址的 mid 預設展開
    }
  }, [mid])


  return (
    <aside>


      {/* 母分類 + 子分類 (Bootstrap Collapse) */}
      <div>
        <h6>所有商品</h6>
        {categories.main.map((main) => (
          <div key={main.id}>
            <div
              className={`btn btn-link main-btn ${mid === String(main.id) ? "active" : ""}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapseMain${main.id}`}
              aria-expanded={mid === String(main.id) ? "true" : "false"}
              // 點母分類 → 篩選 & 展開
              onClick={() => toggleMain(main.id)}
            >
              {main.name}
              <span>{openMain === main.id ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}</span>
            </div>

            <div
              id={`collapseMain${main.id}`}
              className={`collapse ${mid === String(main.id) ? "show" : ""}`}
            >
              <div className="list-group">
                {categories.sub
                  .filter((s) => s.main_id == main.id)
                  .map((sub) => (
                    <button
                      key={sub.id}
                      className={`list-group-item list-group-item-action ${cid === String(sub.id) ? "active" : ""
                        }`}
                      value={sub.id}
                      onClick={(e) =>
                        SubChange({ target: { value: sub.id } })
                      }
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>








      {/* 母分類 */}
      {/* <select
        className="form-select"
        aria-label="select"
        value={mid}
        onChange={MainChange}>
        <option value="">-- 所有母分類 --</option>
        {categories.main.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select> */}

      {/* 子分類 */}
      {/* <select
        className="form-select"
        aria-label="select"
        value={cid}
        onChange={SubChange}>
        <option value="">-- 所有子分類 --</option>
        {filteredSubs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select> */}

      {/* 品牌 */}
      <div>
        <strong>品牌</strong>
        {/* 前 5 筆 */}
        {categories.brand.slice(0, 5).map((c) => (
          <label key={c.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={c.id}
              checked={brands.includes(String(c.id))}
              onChange={BrandChange}
            />
            {c.name}
          </label>
        ))}

        {/* 收合區域 */}
        <div className="collapse" id="moreBrands">
          {categories.brand.slice(5).map((c) => (
            <label key={c.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                value={c.id}
                checked={brands.includes(String(c.id))}
                onChange={BrandChange}
              />
              {c.name}
            </label>
          ))}
        </div>

        {/* 切換按鈕 */}
        {categories.brand.length > 5 && (
          <button
            className="btn btn-sm btn-outline-secondary mt-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#moreBrands"
            onClick={() => setBrandExpanded(!brandExpanded)}
          >
            {brandExpanded ? "收合 -" : "更多 +"}
          </button>
        )}
      </div>

      {/* 屬性 */}
      {filteredAttrs.map(attr => (
        <div key={attr.id}>
          <strong>{attr.name}</strong>
          {attr.options.map(opt => (
            <label key={opt.id}>
              <input
                type="checkbox"
                value={opt.id}
                checked={options.includes(String(opt.id))}
                onChange={OptionChange}
              />
              {opt.value}
            </label>
          ))}
        </div>
      ))}

      <div>
        <strong>價格區間</strong>
        <div>
          <input
            type="number"
            placeholder="最低"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="最高"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
          <button onClick={PriceChange}>套用篩選</button>
          <button onClick={ClearFilters}>清除篩選</button>
        </div>
      </div>


    </aside>
  )
}
