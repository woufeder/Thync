'use client'
import { useEffect, useState } from 'react'
import Header from '../_components/header'
import Footer from '../_components/footer'
import styles from "@/styles/articles.css";

export default function ArticlesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        categories: [],
        tags: [],
        timeRange: []
    })
    
    // 假文章資料
    const [articles] = useState([
        {
            id: 1,
      title: '鍵帽的神 GMK 開箱評測',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2da0dcfc129dd042a77f561e5c0beef8d68aa96e?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    },
    {
            id: 2,
      title: '桌面升級必備：桌墊選購指南',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/c6080f6d278488884a310dc89dbf0175c3207f67?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    },
    {
            id: 3,
      title: '線材新潮流：客製化鍵盤線材指南',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/d84457a3334d59dd5ce5de2310dce1cb3c9dd6aa?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    },
    {
            id: 4,
      title: 'ZF最新討論焦點：鍵盤社群熱門話題',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/37c289667a2fda1e824d78c2f6555922b0a883b5?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    },
    {
            id: 5,
      title: '日本熱銷機械鍵盤：2024年必買推薦',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/5107498c28d52d728d9dad6c49ae41566f4b12c3?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    },
    {
            id: 6,
      title: 'YouTuber開箱：最新鍵盤產品實測',
      description: '本篇將帶你了解各種機械鍵盤軸體、配列與選購重點，幫助你找到最適合自己的鍵盤！從青軸到茶軸，從60%到全尺寸，一次搞懂所有選擇。',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2362d5e86f6f86d50993f0ee64aea45114d9df64?width=919',
      date: '2024-05-01',
      category: '機械鍵盤',
      author: {
        name: '小明',
        avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/67035ada45c0b2524655f4fd5ffdb444b7d86af2?width=56'
      }
    }
    ])

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            const newFilters = { ...prev }
            const index = newFilters[filterType].indexOf(value)
            
            if (index > -1) {
                newFilters[filterType].splice(index, 1)
            } else {
                newFilters[filterType].push(value)
            }
            
            return newFilters
        })
    }

    const clearFilters = () => {
        setFilters({
            categories: [],
            tags: [],
            timeRange: []
        })
        setSearchTerm('')
    }

  return (
        <div className="articles-page">
            <div className="container header">
                <Header />
            </div>
    <main className="main-content">
      <div className="container">
                    {/* Breadcrumb */}
                    <nav className="breadcrumb">
                        <svg className="breadcrumb-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8173 2.7225C12.356 2.295 11.6435 2.295 11.186 2.7225L2.78602 10.5225C2.42602 10.86 2.30602 11.3812 2.48602 11.8387C2.66602 12.2962 3.10477 12.6 3.59977 12.6H4.19977V19.2C4.19977 20.5237 5.27602 21.6 6.59977 21.6H17.3998C18.7235 21.6 19.7998 20.5237 19.7998 19.2V12.6H20.3998C20.8948 12.6 21.3373 12.2962 21.5173 11.8387C21.6973 11.3812 21.5773 10.8562 21.2173 10.5225L12.8173 2.7225ZM11.3998 14.4H12.5998C13.5935 14.4 14.3998 15.2062 14.3998 16.2V19.8H9.59977V16.2C9.59977 15.2062 10.406 14.4 11.3998 14.4Z"/>
                        </svg>
                        <div className="breadcrumb-items">
                            <span className="breadcrumb-text">首頁</span>
                            <svg className="breadcrumb-arrow" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.45455 8.62285L2.33204 15.7417C1.98763 16.0861 1.43073 16.0861 1.08999 15.7417L0.258301 14.91C-0.0861003 14.5656 -0.0861003 14.0124 0.258301 13.668L5.90062 8L0.258301 2.33204C-0.0824365 1.98763 -0.0824365 1.43439 0.258301 1.08999L1.08999 0.258301C1.43439 -0.0861003 1.9913 -0.0861003 2.33204 0.258301L9.45455 7.37715C9.79895 7.72155 9.79895 8.27845 9.45455 8.61919V8.62285Z"/>
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
                            <div className="search-container">
                                <div className="search-input">
                                    <svg className="search-icon" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.75 16.25L12.3855 12.8795M14.25 8.375C14.25 11.8955 11.3955 14.75 7.875 14.75C4.3545 14.75 1.5 11.8955 1.5 8.375C1.5 4.8545 4.3545 2 7.875 2C11.3955 2 14.25 4.8545 14.25 8.375Z" stroke="#94AFCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="text" 
                                        placeholder="搜尋文章標題、內容或標籤..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="filter-actions">
                                <button className="btn-clear" onClick={clearFilters}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" fill="currentColor"/>
                                    </svg>
                                    清除篩選
                                </button>
                                <button className="btn-apply">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor"/>
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
                                        <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 2 15.5v-11z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M6 7h8M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    文章分類
                                </h4>
                                <div className="filter-tags">
                                    {['組裝與改造類', '鍵帽與外觀類', '軸體與手感類', '配件與升級類', '使用與應用類', '評測與開箱類', '潮流與專題類'].map(category => (
                                        <button 
                                            key={category} 
                                            className={`filter-tag ${filters.categories.includes(category) ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('categories', category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="filter-group">
                                <h4 className="filter-title">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M9.293 1.293A1 1 0 0 1 10 1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-.293.707l-8 8a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l8-8z" stroke="currentColor" strokeWidth="1.5"/>
                                        <circle cx="13.5" cy="4.5" r="1.5" fill="currentColor"/>
                                    </svg>
                                    文章標籤
                                </h4>
                                <div className="filter-tags">
                                    {['機械鍵盤', '藍牙', '無線', 'RGB', '客製化', '軸體評測', '組裝教學', '購買指南'].map(tag => (
                                        <button 
                                            key={tag} 
                                            className={`filter-tag ${filters.tags.includes(tag) ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('tags', tag)}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Filters */}
                            <div className="filter-group">
                                <h4 className="filter-title">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    發布時間
                                </h4>
                                <div className="filter-tabs">
                                    {['今天', '本週', '本月', '今年'].map(time => (
                                        <button 
                                            key={time} 
                                            className={`filter-tab ${filters.timeRange.includes(time) ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('timeRange', time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Articles Grid */}
        <div className="articles-grid">
          {articles.map(article => (
                            <article key={article.id} className="article-card">
                                <img src={article.image} alt={article.title} className="article-image" />
                                <div className="article-content">
                                    <div className="article-meta">
                                        <span className="article-date">{article.date}</span>
                                        <span className="article-category">{article.category}</span>
                                    </div>
                                    <h3 className="article-title">{article.title}</h3>
                                    <p className="article-description">{article.description}</p>
                                    <div className="article-footer">
                                        <div className="author-info">
                                            <img src={article.author.avatar} alt={article.author.name} className="author-avatar" />
                                            <span className="author-name">{article.author.name}</span>
                                        </div>
                                        <button className="read-more">閱讀更多</button>
                                    </div>
                                </div>
                            </article>
          ))}
        </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button className="page-btn" disabled>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.1602 7.41L10.5802 12L15.1602 16.59L13.7502 18L7.75016 12L13.7502 6L15.1602 7.41Z" fill="#101C35"/>
                            </svg>
                        </button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn">2</button>
                        <button className="page-btn">...</button>
                        <button className="page-btn">9</button>
                        <button className="page-btn">10</button>
                        <button className="page-btn">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.83984 7.41L13.4198 12L8.83984 16.59L10.2498 18L16.2498 12L10.2498 6L8.83984 7.41Z" fill="#304A6F"/>
                            </svg>
                        </button>
                    </div>
      </div>
    </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}