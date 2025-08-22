"use client";

import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const {user, logout} = useAuth();
  
  return (
    <>
      <h1>登入狀態</h1>
      {user && (
        <>
          <h1>{user.account}</h1>
          <div className="user mb-3">
            <div className="head">
              <img src={user.head} alt="head img here" />
            </div>
            <div className="account fs-3">{user.account}</div>
            <div className="mail">{user.mail}</div>
            <div className="d-flex">
              <div className="btn btn-primary ms-auto btn-logout" onClick={logout}>登出</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
