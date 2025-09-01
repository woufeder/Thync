"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import Header from "../_components/header";
import Sidebar from "../_components/user/sidebar";

export default function UserPage() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState(null); // 一開始是 null，不要亂塞空字串
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 當 user 有值時，同步到 formData
  useEffect(() => {
    if (user) {
      setFormData({
        account: user.account ?? "",
        mail: user.mail ?? "",
        name: user.name ?? "",
        phone: user.phone ?? "",
        gender_id: user.gender_id ?? "",
        year: user.year ?? "",
        month: user.month ?? "",
        date: user.date ?? "",
        city_id: user.city_id ?? "",
        address: user.address ?? "",
        img: user.img ?? "",
      });
      console.log("初始化 formData:", user);
    }
  }, [user]);

  // 等待 user 載入中
  if (!formData) return <div className="loader"></div>;

  // 處理輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 處理圖片點擊
  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  // 圖片上傳
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          img: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 編輯模式
  const handleEdit = () => setIsEditing(true);

  // 取消編輯
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user); // 直接用最新 user 回填
  };

  // 更新資料
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("reactLoginToken");
      if (!token) throw new Error("請先登入");

      const updateData = new FormData();
      for (const key in formData) {
        if (key !== "account" && key !== "mail") {
          const value =
            formData[key] === undefined || formData[key] === null
              ? ""
              : formData[key];
          updateData.append(key, value);
        }
      }

      // 圖片特殊處理
      if (formData.img && formData.img.startsWith("data:")) {
        const imgResponse = await fetch(formData.img);
        const blob = await imgResponse.blob();
        updateData.append("avatar", blob, "avatar.jpg");
      }

      const res = await fetch(
        `http://localhost:3007/api/users/${formData.account}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: updateData,
        }
      );

      const result = await res.json();
      console.log("更新結果:", result);

      if (result.status === "success") {
        setUser(result.data.user);
        // 確保 token 沒丟掉
        const token = localStorage.getItem("reactLoginToken");
        if (token) {
          localStorage.setItem("reactLoginToken", token);
        }
        setIsEditing(false);
        alert("更新成功！");
      } else {
        alert(result.message || "更新失敗");
      }
    } catch (err) {
      alert(`更新失敗: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除帳號
  const handleDeleteAccount = async () => {
    if (!window.confirm("確定要刪除帳號嗎？此操作無法復原！")) return;

    try {
      const token = localStorage.getItem("reactLoginToken");
      const res = await fetch("http://localhost:3007/api/users/account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.status === "success") {
        alert("帳號已刪除");
        localStorage.removeItem("reactLoginToken");
        setUser(null);
        window.location.href = "/user/login";
      } else {
        alert(result.message || "刪除失敗");
      }
    } catch (err) {
      alert(`刪除失敗: ${err.message}`);
    }
  };

  return (
    <div className="container py-3">
      <Header />
      <Sidebar />
      <div className="main-content">
        <h1 className="mb-0">會員資料管理</h1>
        <form onSubmit={handleUpdate}>
          {/* 頭像 */}
          <div className="row mb-3">
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <div onClick={handleImageClick} style={{ cursor: isEditing ? "pointer" : "default" }}>
                <img
                  src={
                    formData.img?.startsWith("data:")
                      ? formData.img
                      : formData.img
                        ? `/images/users/user-photo/${formData.img}`
                        : "./images/user-photo.jpg"
                  }
                  alt="avatar"
                  width="150"
                  height="150"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* 基本欄位 */}
          <div className="mb-3">
            <label>帳號</label>
            <input type="text" className="form-control" value={formData.account} disabled />
          </div>
          <div className="mb-3">
            <label>信箱</label>
            <input type="text" className="form-control" value={formData.mail} disabled />
          </div>
          <div className="mb-3">
            <label>使用者名稱</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mb-3">
            <label>電話</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          <div className="mb-3">
            <label>性別</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender_id"
                  value="1"
                  checked={formData.gender_id === "1"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                男
              </label>
              <label>
                <input
                  type="radio"
                  name="gender_id"
                  value="2"
                  checked={formData.gender_id === "2"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                女
              </label>
              <label>
                <input
                  type="radio"
                  name="gender_id"
                  value="3"
                  checked={formData.gender_id === "3"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                其他
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label>生日</label>
            <div className="row">
              <div className="col">
                <input
                  type="number"
                  name="year"
                  placeholder="年"
                  value={formData.year}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  name="month"
                  placeholder="月"
                  value={formData.month}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  name="date"
                  placeholder="日"
                  value={formData.date}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label>縣市</label>
            <select
              className="form-select"
              name="city_id"
              value={formData.city_id || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="">請選擇</option>
              <option value="1">台北市</option>
              <option value="2">新北市</option>
              <option value="3">桃園市</option>
              <option value="4">台中市</option>
              <option value="5">台南市</option>
              <option value="6">高雄市</option>
              {/* ...其他城市 */}
            </select>
          </div>

          <div className="mb-3">
            <label>地址</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          {/* 按鈕 */}
          {!isEditing ? (
            <button type="button" onClick={handleEdit} className="btn btn-primary">
              編輯
            </button>
          ) : (
            <>
              <button type="submit" disabled={isLoading} className="btn btn-success me-2">
                {isLoading ? "更新中..." : "確認更新"}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                取消
              </button>
            </>
          )}
          <button type="button" onClick={handleDeleteAccount} className="btn btn-danger ms-2">
            刪除帳號
          </button>
        </form>
      </div>
    </div>
  );
}
