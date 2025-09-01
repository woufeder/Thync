"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";
const appKey = "reactLoginToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const loginRoute = "/user/login";
  const protectedRoutes = ["/user"];

  // 登入
  const login = async (mail, password) => {
    try {
      const API = "http://localhost:3007/api/users/login";
      const formData = new FormData();
      formData.append("mail", mail);
      formData.append("password", password);

      const res = await fetch(API, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      console.log("login result:", result);

      if (result.status === "success") {
        alert(result.message);

        const token = result.data.token;
        const basicUser = result.data.user;

        // 存 token
        localStorage.setItem(appKey, token);

        // 再去拿完整 profile
        const profileRes = await fetch(
          `http://localhost:3007/api/users/${basicUser.account}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profile = await profileRes.json();

        if (profile.status === "success") {
          setUser(profile.data); // 完整 user
        } else {
          setUser(basicUser); // fallback
        }

        router.replace("/user");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("login error:", error);
    }
  };

  // 登出
  const logout = async () => {
    try {
      const API = "http://localhost:3007/api/users/logout";
      const token = localStorage.getItem(appKey);
      if (!token) throw new Error("Token不存在");

      await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem(appKey);
      router.replace(loginRoute);
    }
  };

  // 註冊
  const add = async (account, mail, password) => {
    try {
      const API = "http://localhost:3007/api/users";
      const formData = new FormData();
      formData.append("account", account);
      formData.append("mail", mail);
      formData.append("password", password);

      const res = await fetch(API, { method: "POST", body: formData });
      const result = await res.json();
      console.log("register result:", result);

      if (result.status === "success") {
        alert(result.message);
        router.replace("/user/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("register error:", error);
    }
  };

  // 使用者列表
  const list = async () => {
    try {
      const API = "http://localhost:3007/api/users";
      const res = await fetch(API);
      const result = await res.json();
      console.log("list result:", result);

      if (result.status === "success") {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("list error:", error);
      setUsers([]);
    }
  };

  // Token 驗證
  useEffect(() => {
    const checkToken = async () => {
      const API = "http://localhost:3007/api/users/status";
      const token = localStorage.getItem(appKey);
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        console.log("status result:", result);

        if (result.status === "success") {
          const newToken = result.data.token;
          const basicUser = result.data.user;

          // 存新的 token
          localStorage.setItem(appKey, newToken);

          // 再去撈完整 user profile
          const profileRes = await fetch(
            `http://localhost:3007/api/users/${basicUser.account}`,
            { headers: { Authorization: `Bearer ${newToken}` } }
          );
          const profile = await profileRes.json();

          if (profile.status === "success") {
            setUser(profile.data);
          } else {
            setUser(basicUser);
          }
        } else {
          // ⚠️ 這裡修改：不要立刻登出，保留現有 user
          console.warn("status 驗證失敗，保留現有登入狀態");
        }
      } catch (error) {
        console.error("status check error:", error);
        // ⚠️ 這裡修改：不要立刻登出，保留現有 user
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);


  // 路由保護
  useEffect(() => {
    const token = localStorage.getItem(appKey);
    if (!isLoading && !user && !token && protectedRoutes.includes(pathname)) {
      router.replace(loginRoute);
    }
  }, [isLoading, user, pathname]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, list, users, setUser, add }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
