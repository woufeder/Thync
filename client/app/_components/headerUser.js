"use client";

import { useAuth } from "@/hooks/use-auth";

export default function HeaderUser() {
  const { user, logout } = useAuth();

  return (
    <>
      {user && (
        <>
          <div className="user">

            {/* <div className="account fs-3">{user.account}</div>
            <div className="mail">{user.mail}</div>
            <div className="d-flex">
              <div className="btn btn-primary ms-auto btn-logout" onClick={logout}>登出</div>
            </div> */}
          </div>

          <div className="dropdown">
            <a className="btn head" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={user.head} alt="head img here" />
            </a>
            <ul className="dropdown-menu">              <p className="dropdown-item-text">{user.account}</p>
              <li><a className="dropdown-item" href="#">會員資料管理</a></li>
              <li><a className="dropdown-item" href="#">訂單查詢</a></li>
              <li><a className="dropdown-item" href="#">貨到通知</a></li>
              <li><a className="dropdown-item" href="#">我的優惠券</a></li>
              <li><a className="dropdown-item" href="#">已追蹤商品</a></li>
              <li><a className="dropdown-item" href="#">已收藏文章</a></li>
              <li><a className="dropdown-item " onClick={logout}>登出</a></li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}