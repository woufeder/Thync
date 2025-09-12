'use client'
import { useEffect, useState } from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import ArticleCard from '../_components/articleCard'
import useArticle from '../../hooks/use-article'
import styles from "@/styles/articles.css";

export default function ArticlesPage() {
  const {
    articles,
    loading,
    error,
    pagination,
    categories,
    tags,
    fetchArticles,
    fetchOptions,
    clearError
  } = useArticle()

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    cid: [], // 改為陣列以支援多選
    tag_id: [], // 改為陣列以支援多選
    search: '',
    page: 1,
    per_page: 6
  })

  // 初始化載入
  useEffect(() => {
    console.log('🚀 文章頁面初始化載入')
    fetchOptions()
    fetchArticles({ page: 1, per_page: 6 })
  }, [])

  // 篩選變更時重新載入
  const applyFilters = () => {
    const params = {
      page: 1,
      per_page: filters.per_page
    }

    // 將選中的分類ID轉為逗號分隔的字串
    if (filters.cid.length > 0) params.cid = filters.cid.join(',')
    // 將選中的標籤ID轉為逗號分隔的字串
    if (filters.tag_id.length > 0) params.tag_id = filters.tag_id.join(',')
    if (searchTerm.trim()) params.search = searchTerm.trim()

    fetchArticles(params)
    setFilters(prev => ({ ...prev, page: 1 }))
  }

  // 分頁變更
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.total_pages) return

    const params = {
      page: newPage,
      per_page: filters.per_page
    }

    // 將選中的分類ID轉為逗號分隔的字串
    if (filters.cid.length > 0) params.cid = filters.cid.join(',')
    // 將選中的標籤ID轉為逗號分隔的字串
    if (filters.tag_id.length > 0) params.tag_id = filters.tag_id.join(',')
    if (searchTerm.trim()) params.search = searchTerm.trim()

    fetchArticles(params)
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  // 篩選處理 - 支援多選
  const handleCategoryChange = (categoryId) => {
    setFilters(prev => {
      const currentCategories = prev.cid || []
      const isSelected = currentCategories.includes(categoryId)

      let newCategories
      if (isSelected) {
        // 如果已選中，則移除
        newCategories = currentCategories.filter(id => id !== categoryId)
      } else {
        // 如果未選中，則添加
        newCategories = [...currentCategories, categoryId]
      }

      return {
        ...prev,
        cid: newCategories
      }
    })
  }

  const handleTagChange = (tagId) => {
    setFilters(prev => {
      const currentTags = prev.tag_id || []
      const isSelected = currentTags.includes(tagId)

      let newTags
      if (isSelected) {
        // 如果已選中，則移除
        newTags = currentTags.filter(id => id !== tagId)
      } else {
        // 如果未選中，則添加
        newTags = [...currentTags, tagId]
      }

      return {
        ...prev,
        tag_id: newTags
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      cid: [], // 清空陣列
      tag_id: [], // 清空陣列
      search: '',
      page: 1,
      per_page: 6
    })
    setSearchTerm('')
    fetchArticles({ page: 1, per_page: 6 })
  }



  // 搜尋處理
  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  // 載入狀態
  if (loading && articles.length === 0) {
    return (
      <div className="articles-page">
        <div className="container header">
          <Header />
        </div>
        <main className="main-content">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>載入文章中...</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                正在連接到 http://localhost:3007/api/articles
              </p>
            </div>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="articles-page">
        <div className="container header">
          <Header />
        </div>
        <main className="main-content">
          <div className="container">
            <div className="error-container">
              <h3>😔 載入失敗</h3>
              <p><strong>錯誤訊息：</strong>{error}</p>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                請檢查：<br />
                • 後端伺服器是否在 http://localhost:3007 運行？<br />
                • 網路連線是否正常？<br />
                • 資料庫是否正確連接？
              </p>
              <button onClick={() => {
                console.log('🔄 用戶點擊重試按鈕')
                clearError()
                fetchArticles({ page: 1, per_page: 6 })
              }}>重試</button>
            </div>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    )
  }

  return (
    <div className="articles-page">
      <Header />
      <main className="main-content">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <svg className="breadcrumb-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8173 2.7225C12.356 2.295 11.6435 2.295 11.186 2.7225L2.78602 10.5225C2.42602 10.86 2.30602 11.3812 2.48602 11.8387C2.66602 12.2962 3.10477 12.6 3.59977 12.6H4.19977V19.2C4.19977 20.5237 5.27602 21.6 6.59977 21.6H17.3998C18.7235 21.6 19.7998 20.5237 19.7998 19.2V12.6H20.3998C20.8948 12.6 21.3373 12.2962 21.5173 11.8387C21.6973 11.3812 21.5773 10.8562 21.2173 10.5225L12.8173 2.7225ZM11.3998 14.4H12.5998C13.5935 14.4 14.3998 15.2062 14.3998 16.2V19.8H9.59977V16.2C9.59977 15.2062 10.406 14.4 11.3998 14.4Z" />
            </svg>
            <div className="breadcrumb-items">
              <span className="breadcrumb-text">首頁</span>
              <svg className="breadcrumb-arrow" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.45455 8.62285L2.33204 15.7417C1.98763 16.0861 1.43073 16.0861 1.08999 15.7417L0.258301 14.91C-0.0861003 14.5656 -0.0861003 14.0124 0.258301 13.668L5.90062 8L0.258301 2.33204C-0.0824365 1.98763 -0.0824365 1.43439 0.258301 1.08999L1.08999 0.258301C1.43439 -0.0861003 1.9913 -0.0861003 2.33204 0.258301L9.45455 7.37715C9.79895 7.72155 9.79895 8.27845 9.45455 8.61919V8.62285Z" />
              </svg>
              <span className="breadcrumb-text">文章分享</span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">文章分享</h1>
            <p className="page-description">探索最新的鍵盤知識、使用技巧和產品評測，讓你的鍵盤使用體驗更加分</p>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            {/* Search Bar */}
            <div className="articles-filter-header">
              <form onSubmit={handleSearch} className="search-container">
                <div className="search-input">
                  <svg className="search-icon" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.75 16.25L12.3855 12.8795M14.25 8.375C14.25 11.8955 11.3955 14.75 7.875 14.75C4.3545 14.75 1.5 11.8955 1.5 8.375C1.5 4.8545 4.3545 2 7.875 2C11.3955 2 14.25 4.8545 14.25 8.375Z" stroke="#94AFCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="搜尋文章標題、內容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              <div className="filter-actions">
                <button className="btn-clear" onClick={clearFilters}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" fill="currentColor" />
                  </svg>
                  清除篩選
                </button>
                <button className="btn-apply" onClick={applyFilters}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor" />
                  </svg>
                  套用篩選
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="filter-content">
              {/* Categories */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 15.5v-11z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6 7h8M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  文章分類
                </h4>
                <div className="filter-tags">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`filter-tag ${filters.cid.includes(category.id) ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="filter-group">
                <h4 className="filter-title">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M9.293 1.293A1 1 0 0 1 10 1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-.293.707l-8 8a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l8-8z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="13.5" cy="4.5" r="1.5" fill="currentColor" />
                  </svg>
                  文章標籤
                </h4>
                <div className="filter-tags">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      className={`filter-tag ${filters.tag_id.includes(tag.id) ? 'active' : ''}`}
                      onClick={() => handleTagChange(tag.id)}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 載入中提示 */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>載入中...</p>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length === 0 ? (
            <div className="empty-container">
              <p>沒有找到符合條件的文章</p>
            </div>
          ) : (
            <div className="a-cards">
              <div className="row">
                {articles.map(article => (
                  <div key={article.id} className="col">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={!pagination.has_prev}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.1602 7.41L10.5802 12L15.1602 16.59L13.7502 18L7.75016 12L13.7502 6L15.1602 7.41Z" fill="#101C35" />
                </svg>
              </button>

              {(() => {
                const currentPage = pagination.current_page
                const totalPages = pagination.total_pages
                const pages = []

                if (totalPages <= 5) {
                  // 如果總頁數 <= 5，顯示所有頁碼
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  // 如果總頁數 > 5，智能顯示頁碼
                  if (currentPage <= 3) {
                    // 當前頁在前面，顯示 1, 2, 3, 4, 5
                    pages.push(1, 2, 3, 4, 5)
                  } else if (currentPage >= totalPages - 2) {
                    // 當前頁在後面，顯示最後 5 頁
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // 當前頁在中間，顯示前後各 2 頁
                    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                      pages.push(i)
                    }
                  }
                }

                return pages.map(pageNum => (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))
              })()}

              <button
                className="page-btn"
                disabled={!pagination.has_next}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.83984 7.41L13.4198 12L8.83984 16.59L10.2498 18L16.2498 12L10.2498 6L8.83984 7.41Z" fill="#304A6F" />
                </svg>
              </button>
            </div>
          )}

          {/* 分頁資訊 */}
          {pagination && (
            <div className="pagination-info">
              <p>
                第 {pagination.current_page} 頁，共 {pagination.total_pages} 頁
                （共 {pagination.total} 篇文章）
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}