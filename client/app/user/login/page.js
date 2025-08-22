"use client"

import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import style from "@/styles/una.module.sass";
import style2 from "@/styles/woufeder.module.sass";
import Link from "next/link"

export default function UserLoginPage() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { login, user, logout, isLoading } = useAuth()

  const onclick = () => {
    login(account, password);
  }

  if (isLoading) {

    return (
      <div className="container">
        Loading......
      </div>
    );
  }


  if (user) {
    return (
      <>
        {user && (
          <div className="container py-3">
            <h1>登入狀態</h1>
            <h1>{user.account}</h1>
            <div className="user mb-3">
              <div className="head">
                <img src={user.head} alt="head img here" />
              </div>
              <div className="account fs-3">{user.account}</div>
              <div className="mail">{user.mail}</div>
              <div className="d-flex">
                <div className="btn btn-primary ms-auto btn-logout me-1" onClick={logout}>登出</div>
                <Link className="btn btn-primary" href="/">回首頁</Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="container py-3">
      <h1>
        <span className={style.color1}>登出</span>
        <span className={style2.color1}>狀態</span>
      </h1>
      <div className="input-group mb-2">
        <span className={`input-group-text ${style.color1}`}>帳號</span>
        <input type="text" name="account" className="form-control" value={account} onChange={(e) => { setAccount(e.target.value) }} />
      </div>
      <div className="input-group mb-2">
        <span className={`input-group-text ${style2.color1}`}>密碼</span>
        <input type="password" name="password" className="form-control" value={password} onChange={(e) => { setPassword(e.target.value) }} />
      </div>
      <div className="d-flex">
        <div className="btn btn-primary ms-auto btn-login me-1" onClick={onclick}>送出</div>
        <Link className="btn btn-primary" href="/">回首頁</Link>
      </div>
    </div>
  )
}