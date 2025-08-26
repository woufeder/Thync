"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
const appKey = "reactLoginToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  // 這裡只要useState裡面有東西，他就會是登入狀態
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const loginRoute = "/user/login";
  const protectedRoutes = ["/user"];

  const login = async (account, password) => {
    console.log(`在use-auth.js裡面，登入帳號: ${account} 密碼: ${password}`);
    const API = "http://localhost:3007/api/users/login";
    const formData = new FormData();
    formData.append("account", account);
    formData.append("password", password);
    // 這裡的formData是用來傳送表單資料的

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      // 這裡的result是從API回傳的資料
      console.log(result);
      if (result.status === "success") {
        console.log("登入成功");
        alert(result.message);

        const token = result.data.token;
        setUser(result.data.user);
        // 這裡的setUser是用來設定登入後的使用者資料
        localStorage.setItem(appKey, token);
        // 將token存到localStorage裡面
        // 這樣下次進來的時候就可以從localStorage裡面取出token
      } else {
        console.log("登入失敗");
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    console.log("logout");
    const API = "http://localhost:3007/api/users/logout";
    const token = localStorage.getItem(appKey);
    try {
      if (!token) throw new Error("Token不存在");
      const res = await fetch(API, {
        method: "POST",
        // 前端把 Token 放入 Authorization Header 欄位
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === "success") {
        const token = result.data;
        setUser(null);
        localStorage.removeItem(appKey);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.log(`解析token失敗: ${error.message}`);
      setUser(null);
      localStorage.removeItem(appKey);
      alert(error.message);
    }
  };

  const list = async () => {
    const API = "http://localhost:3007/api/users";

    try {
      const res = await fetch(API);
      const result = await res.json();
      console.log(result);

      if (result.status === "success") {
        setUsers(result.data);
      }
    } catch (error) {
      console.log(`使用者列表取得: ${error.message}`);
      setUsers([]);
      alert(error.message);
    }
  };

  // 沒有登入不能夠觀看2
  useEffect(() => {
    if (!isLoading && !user && protectedRoutes.includes(pathname)) {
      router.replace(loginRoute);
    }
  }, [isLoading, user, pathname]);

  useEffect(() => {
    const API = "http://localhost:3007/api/users/status";
    const token = localStorage.getItem(appKey);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    const checkToken = async () => {
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.status === "success") {
          const token = result.data.token;
          setUser(result.data.user);
          localStorage.setItem(appKey, token);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(`解析token失敗: ${error.message}`);
        setUser(null);
        localStorage.removeItem(appKey);
      }
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, list, users }}
    >
      {/* 這裡的第一個大括號表示要寫程式，第二個大括號表示要寫物件 */}

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// 有省略大括號，原本應該是{useContext(AuthContext)}
