"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
// localStorage 的鍵名
const appKey = "reactLoginToken";

export function AuthProvider({ children }) {
  // 目前登入的使用者
  const [user, setUser] = useState(null);
  // 所有使用者列表
  const [users, setUsers] = useState([]);
  // 這裡只要useState裡面有東西，他就會是登入狀態
  const [isLoading, setIsLoading] = useState(true);

  // 設定路由導航規則
  const router = useRouter();
  const pathname = usePathname();
  const loginRoute = "/user/login";
  // 定義需登入才能訪問的路由列表
  const protectedRoutes = ["/user"];

  const login = async (mail, password) => {
    console.log(`在 use-auth.js 裡面，登入帳號: ${mail} 密碼: ${password}`);
    const API = "http://localhost:3007/api/users/login";
    // 創建表單資料物件模仿 HTML 表單提交的資料格式
    const formData = new FormData();
    // 添加 key value pair 資料
    formData.append("mail", mail);
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
        // 這裡的setUser是用來設定登入後的使用者資料
        setUser(result.data.user);
        // 存 token 到瀏覽器的 localStorage
        localStorage.setItem(appKey, token);
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
      // 即使登出失敗，還是要強制清除狀態
    } catch (error) {
      console.log(`解析token失敗: ${error.message}`);
      setUser(null);
      localStorage.removeItem(appKey);
      alert(error.message);
    }
  };

  const add = async (name, mail, password) => {
    console.log(`在 use-auth.js 裡面，註冊帳號: ${mail} 密碼: ${password}`);
    const API = "http://localhost:3007/api/users";
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mail", mail);
    formData.append("password", password);

    try {
      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log(result);
      if (result.status === "success") {
        console.log("註冊成功");
        alert(result.message);
        router.replace("/user/login");
      } else {
        console.log("註冊失敗");
        alert(result.message);
      }
    } catch (error) {
      console.log(`註冊失敗: ${error.message}`);
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
      // 以防保留上次載入的使用者列表
      setUsers([]);
      alert(error.message);
    }
  };

  // 沒有登入不能夠觀看2
  // 路由保護
  useEffect(() => {
    if (!isLoading && !user && protectedRoutes.includes(pathname)) {
      router.replace(loginRoute);
    }
  }, [isLoading, user, pathname]);

  // Token 驗證
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
      value={{ user, login, logout, isLoading, list, users, add }}
    >
      {/* 這裡的第一個大括號表示要寫程式，第二個大括號表示要寫物件 */}

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// 有省略大括號，原本應該是{useContext(AuthContext)}
