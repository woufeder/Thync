'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../_components/header'
import Footer from '../../../_components/footer'
import '../../../../styles/admin.css'

export default function ArticlesTrashPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalArticles, setTotalArticles] = useState(0)
    const perPage = 10

    // 權限檢查已暫時移除用於測試
    // useEffect(() => {
    //     if (!isLoading && (!user || user.role !== 'admin')) {
    //         router.replace("/user/login")
    //     }
    // }, [user, isLoading, router])

    // 格式化日期
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // 獲取已刪除的文章列表
    const fetchDeletedArticles = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams({
                page: currentPage,
                per_page: perPage,
                // 移除 deleted: 'true'，因為後端 /trash 路由已經只查詢 is_deleted = 1 的文章
                ...(searchTerm && { search: searchTerm })
            })

            const response = await fetch(`http://localhost:3007/api/articles/trash?${queryParams}`)
            if (!response.ok) {
                throw new Error('獲取垃圾桶文章失敗')
            }
            
            const data = await response.json()
            setArticles(data.data.articles)
            setTotalPages(data.data.pagination.total_pages)
            setTotalArticles(data.data.pagination.total)
            setError(null) // 清除錯誤狀態
        } catch (err) {
            console.error('獲取垃圾桶文章失敗:', err)
            setError(err.message)
            setArticles([])
        } finally {
            setLoading(false)
        }
    }

    // 恢復文章
    const handleRestore = async (articleId) => {
        if (!confirm('確定要恢復此文章嗎？')) return

        try {
            const response = await fetch(`http://localhost:3007/api/articles/${articleId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_deleted: 0 })
            })

            if (!response.ok) {
                throw new Error('恢復失敗')
            }

            // 重新獲取文章列表
            fetchDeletedArticles()
            alert('文章已成功恢復')
        } catch (err) {
            alert('恢復失敗：' + err.message)
        }
    }

    // 永久刪除文章
    const handlePermanentDelete = async (articleId) => {
        if (!confirm('確定要永久刪除此文章嗎？此操作無法復原！')) return
        if (!confirm('再次確認：您即將永久刪除此文章，此操作無法復原！')) return

        try {
            const response = await fetch(`http://localhost:3007/api/articles/${articleId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('永久刪除失敗')
            }

            // 重新獲取文章列表
            fetchDeletedArticles()
            alert('文章已永久刪除')
        } catch (err) {
            alert('刪除失敗：' + err.message)
        }
    }

    // 清空垃圾桶
    const handleEmptyTrash = async () => {
        if (articles.length === 0) return
        
        if (!confirm(`確定要清空垃圾桶嗎？這將永久刪除所有 ${articles.length} 篇文章，此操作無法復原！`)) return
        if (!confirm('最後確認：您即將永久刪除垃圾桶中的所有文章，此操作無法復原！')) return

        try {
            const response = await fetch('http://localhost:3007/api/articles/trash/empty', {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('清空垃圾桶失敗')
            }

            // 重新獲取文章列表
            fetchDeletedArticles()
            alert('垃圾桶已清空')
        } catch (err) {
            alert('清空失敗：' + err.message)
        }
    }

    // 搜尋處理
    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchDeletedArticles()
    }

    useEffect(() => {
        // 移除權限檢查，直接載入已刪除文章
        fetchDeletedArticles()
    }, [currentPage])

    // 移除權限檢查
    // if (isLoading || !user) return null

    return (
        <>
            <Header />
            
            <div className="admin-page">
                <main className="admin-main">
                <div className="admin-container">
                    {/* 頁面標題 */}
                    <div className="admin-header">
                        <div className="admin-title-section">
                            <h1 className="admin-page-title">垃圾桶</h1>
                            <p className="admin-page-subtitle">管理已刪除的文章</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {articles.length > 0 && (
                                <button 
                                    onClick={handleEmptyTrash}
                                    className="admin-btn-secondary"
                                    style={{ color: '#DC3545', borderColor: '#DC3545' }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    清空垃圾桶
                                </button>
                            )}
                            <Link href="/admin/articles" className="admin-btn-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                返回文章管理
                            </Link>
                        </div>
                    </div>

                    {/* 搜尋 */}
                    <div className="admin-filters">
                        <form onSubmit={handleSearch} className="admin-search-form">
                            <div className="search-input-group">
                                <input
                                    type="text"
                                    placeholder="搜尋已刪除的文章..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="admin-search-input"
                                />
                                <button type="submit" className="admin-search-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                            </div>
                        </form>

                        <div className="admin-sort-controls">
                            <span style={{ color: '#6B6A67', fontSize: '14px' }}>
                                {totalArticles} 篇已刪除文章
                            </span>
                        </div>
                    </div>

                    {/* 統計資訊 */}
                    <div className="admin-stats">
                        <div className="stat-card">
                            <div className="stat-number">{totalArticles}</div>
                            <div className="stat-label">已刪除文章</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{currentPage}</div>
                            <div className="stat-label">當前頁面</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{totalPages}</div>
                            <div className="stat-label">總頁數</div>
                        </div>
                        <Link href="/admin/articles" className="trash-btn-card">
                            <div className="trash-btn-content">
                                文章管理
                            </div>
                        </Link>
                    </div>

                    {/* 文章列表 */}
                    {loading ? (
                        <div className="admin-loading">
                            <div className="loading-spinner"></div>
                            <p>載入已刪除文章中...</p>
                        </div>
                    ) : error ? (
                        <div className="admin-error">
                            <p>錯誤：{error}</p>
                            <button onClick={fetchDeletedArticles} className="admin-btn-secondary">重新載入</button>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="empty-trash">
                            <div className="empty-trash-icon">🗑️</div>
                            <h3>垃圾桶是空的</h3>
                            <p>目前沒有已刪除的文章</p>
                        </div>
                    ) : (
                        <>
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>封面</th>
                                            <th>標題</th>
                                            <th>分類</th>
                                            <th>刪除時間</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.map((article) => (
                                            <tr key={article.id} className="admin-table-row">
                                                <td className="article-id">{article.id}</td>
                                                <td className="article-cover">
                                                    <div className="cover-thumbnail">
                                                        <img 
                                                            src={article.cover_image ? `/images/articles/${article.cover_image}` : '/images/articleSample.jpg'} 
                                                            alt={article.title}
                                                            onError={(e) => {
                                                                e.target.src = '/images/articleSample.jpg'
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="article-title">
                                                    <div className="title-content">
                                                        <h3 style={{ opacity: 0.7 }}>{article.title}</h3>
                                                        <p className="article-excerpt" style={{ opacity: 0.6 }}>
                                                            {article.content ? 
                                                                article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                                                                : '無內容預覽'
                                                            }
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="article-category">
                                                    <span className="category-badge" style={{ opacity: 0.7 }}>
                                                        {article.category_name || '未分類'}
                                                    </span>
                                                </td>
                                                <td className="article-date">
                                                    <div className="date-info">
                                                        <div className="created-date" style={{ color: '#DC3545' }}>
                                                            {formatDate(article.deleted_at || article.updated_at)}
                                                        </div>
                                                        <div className="updated-date">
                                                            建立: {formatDate(article.created_at)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="article-actions">
                                                    <div className="trash-actions">
                                                        <button 
                                                            onClick={() => handleRestore(article.id)}
                                                            className="admin-btn-icon restore-btn"
                                                            title="恢復文章"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M8 16l-5 5v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handlePermanentDelete(article.id)}
                                                            className="admin-btn-icon permanent-delete-btn"
                                                            title="永久刪除"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 分頁控制 */}
                            {totalPages > 1 && (
                                <div className="admin-pagination">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        上一頁
                                    </button>
                                    
                                    <div className="pagination-info">
                                        <span className="current-page">{currentPage}</span>
                                        <span className="page-separator">/</span>
                                        <span className="total-pages">{totalPages}</span>
                                    </div>
                                    
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
                                    >
                                        下一頁
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                </main>
            </div>
            
            <Footer />
        </>
    )
}
