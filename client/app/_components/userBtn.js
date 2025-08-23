'use client'
import Link from "next/link";
export default function userBtn() {
    return (
        <div className="py-3">
            <Link href="/user/woufeder" className="btn btn-primary me-1">使用者的主頁(R)</Link>
            <Link href="/user/add" className="btn btn-primary me-1">新增使用者(C)</Link>
            <Link href="/user/edit" className="btn btn-primary me-1">修改使用者(U)</Link>
            <Link href="/user/login" className="btn btn-primary me-1">使用者登入</Link>
            <Link href="/user" className="btn btn-primary me-1">使用者列表頁(R)</Link>
        </div>
    )
}
