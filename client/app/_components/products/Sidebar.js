"use client"

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
  handleMainChange,
  handleSubChange,
  handleBrandChange,
  handleOptionChange,
  handlePriceChange,
  handleClearFilters   // ⭐ 新增
}) {

  return (
    <aside>
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
      {categories.brand.map((c) => (
        <label key={c.id}>
          <input
            type="checkbox"
            value={c.id}
            checked={brands.includes(String(c.id))}
            onChange={handleBrandChange}
          />
          {c.name}
        </label>
      ))}

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
                onChange={handleOptionChange}
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
          <button onClick={handlePriceChange}>套用篩選</button>
          <button onClick={handleClearFilters}>清除篩選</button>
        </div>
      </div>


    </aside>
  )
}
