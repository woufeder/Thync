"use client"

import style from '@/styles/products.css'
import { useState, useEffect } from "react"
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
  setOptions,
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
      <div className='title-area'>
        <h6>所有商品</h6>
      </div>
      {/* 母分類 + 子分類 (Bootstrap Collapse) */}
      <div className='category'>
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

      {/* 品牌 */}

      <div className='brand-area form-check'>
        <h6>品牌</h6>
        {/* 前 5 筆 */}
        {categories.brand.slice(0, 5).map((c) => (
          <label key={c.id} className="form-check-label">
            <input
              className="form-check-input"
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
            <label key={c.id} className="form-check-label">
              <input
                className="form-check-input"
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
        <div key={attr.id} style={{ marginBottom: "1rem" }}>
          <strong>{attr.name}</strong>
          <select
            className="form-select"
            value={options.find(id => attr.options.some(opt => String(opt.id) === id)) || ""}
            onChange={e => {
              const value = e.target.value
              let newOptions = [...options]

              // 先把同一個屬性的舊選項移除
              newOptions = newOptions.filter(id => !attr.options.some(opt => String(opt.id) === id))

              // 如果有新值就加進去
              if (value) {
                newOptions.push(value)
              }

              // 更新狀態
              setOptions(newOptions)

              // 更新 URL
              const params = new URLSearchParams(window.location.search)
              if (newOptions.length > 0) {
                params.set("options", newOptions.join(","))
              } else {
                params.delete("options")
              }
              window.history.pushState({}, "", `?${params.toString()}`)
            }}
          >
            <option value="">請選擇</option>
            {attr.options.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.value}
              </option>
            ))}
          </select>
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
