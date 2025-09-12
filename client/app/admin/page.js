'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../_components/header'
import Footer from '../_components/footer'
import '../../styles/admin.css'

export default function AdminPage() {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [adminAccessAllowed, setAdminAccessAllowed] = useState(false)

    // 前端簡易網址驗證：未登入（或過期）則導向 /admin/login
    useEffect(() => {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn')
        const loginTime = localStorage.getItem('adminLoginTime')
        const isValid = adminLoggedIn === 'true' && loginTime && (Date.now() - parseInt(loginTime, 10) < 24 * 60 * 60 * 1000)

        if (!isValid) {
            alert('請從後台登入頁面進入系統')
            router.replace('/admin/login')
            return
        }

        setAdminAccessAllowed(true)
    }, [router])

    const handleAdminLogout = () => {
        localStorage.removeItem('adminLoggedIn')
        localStorage.removeItem('adminLoginTime')
        router.replace('/admin/login')
    }

    // 未通過檢查前不渲染內容，避免畫面閃爍
    if (!adminAccessAllowed) return null

    return (
        <>
            <Header />
            
            <div className="admin-page">
                <main className="admin-main">
                    <div className="admin-container">
                        {/* 歡迎區塊 */}
                        <div className="admin-header">
                            <div className="admin-title-section">
                                <h1 className="admin-page-title">管理後台</h1>
                                <p className="admin-page-subtitle">歡迎回來，{user?.name || '管理員'}</p>
                            </div>
                            <div className="admin-actions" style={{ marginLeft: 'auto' }}>
                                <button onClick={handleAdminLogout} className="admin-logout-button" style={{
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}>
                                    登出
                                </button>
                            </div>
                        </div>

                    {/* 管理功能卡片 */}
                    <div className="admin-dashboard">
                        <div className="dashboard-grid">
                            {/* 文章管理卡片 */}
                            <Link href="/admin/articles" className="dashboard-card">
                                <div className="card-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">文章管理</h3>
                                    <p className="card-description">管理所有文章內容，包含新增、編輯、刪除功能</p>
                                </div>
                                <div className="card-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            {/* 新增文章快捷卡片 */}
                            <Link href="/admin/articles/create" className="dashboard-card">
                                <div className="card-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">新增文章</h3>
                                    <p className="card-description">快速建立新的文章內容</p>
                                </div>
                                <div className="card-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            {/* 垃圾桶卡片 */}
                            <Link href="/admin/articles/trash" className="dashboard-card">
                                <div className="card-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">垃圾桶</h3>
                                    <p className="card-description">管理已刪除的文章，可恢復或永久刪除</p>
                                </div>
                                <div className="card-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>

                            {/* 返回前台卡片 */}
                            <Link href="/" className="dashboard-card">
                                <div className="card-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">返回前台</h3>
                                    <p className="card-description">回到網站前台頁面</p>
                                </div>
                                <div className="card-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>

                    </div>
                </main>
            </div>
            
            <Footer />
        </>
    )
}
