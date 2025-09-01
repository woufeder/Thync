"use client";

import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import UserBtn from "../_components/userBtn";
import Header from "../_components/header";
import Sidebar from "../_components/user/sidebar";

export default function UserPage() {
  // 頁面初始化時自動 fetch 最新 user 資料
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("reactLoginToken");
      // 這裡建議用 localStorage 或 context 的帳號
      const userAccount = user?.account || localStorage.getItem("userAccount");
      if (token && userAccount) {
        const res = await fetch(
          `http://localhost:3007/api/users/${userAccount}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUser(data.data);
      }
    };
    fetchUser();
  }, []);
  const { list, user, setUser, users } = useAuth();

  const fileInputRef = useRef(null);

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 表單狀態管理
  const [formData, setFormData] = useState({
    account: user?.account || "",
    mail: user?.mail || "",
    name: user?.name || "",
    phone: user?.phone || "",
    gender_id: user?.gender_id || "",
    year: user?.year || "",
    month: user?.month || "",
    date: user?.date || "",
    city_id: user?.city_id || "",
    address: user?.address || "",
    img: user?.img || "",
  });


  // 監聽 user 資料，user 一更新就同步 formData
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
  }
}, [user]);

    console.log(formData);

  // 處理表單輸入變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 處理圖片上傳
  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

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

  // 開始編輯模式
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 取消編輯
  const handleCancel = () => {
    setIsEditing(false);
    // 重置表單資料為原始用戶資料
    setFormData({
      account: user?.account || "",
      mail: user?.mail || "",
      name: user?.name || "",
      phone: user?.phone || "",
      gender_id: user?.gender_id || "",
      year: user?.year || "",
      month: user?.month || "",
      date: user?.date || "",
      city_id: user?.city_id || "",
      address: user?.address || "",
      img: user?.img || "",
    });
  };

  // 確認更新 - 提交到後端
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("reactLoginToken");
      if (!token) throw new Error("請先登入");

      // 取得 account（假設 user 物件有 account 屬性，否則請用 id）
      const userAccount = user?.account;
      if (!userAccount) throw new Error("找不到使用者帳號");

      // 準備表單資料
      const updateData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "account" && key !== "mail") {
          updateData.append(key, formData[key]);
        }
      });

      // 處理圖片（如有 base64）
      if (formData.img && formData.img.startsWith("data:")) {
        const imgResponse = await fetch(formData.img);
        const blob = await imgResponse.blob();
        updateData.append("avatar", blob, "avatar.jpg");
      }

      const response = await fetch(
        `http://localhost:3007/api/users/${userAccount}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // 不要加 Content-Type，讓瀏覽器自動處理
          },
          body: updateData,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("個人資料更新成功！");
        // 重新取得最新 user 資料
        const res = await fetch(
          `http://localhost:3007/api/users/${userAccount}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setUser(data.data); // 用後端回傳的最新 user 資料
        console.log(user);
        setIsEditing(false);
      } else {
        throw new Error(result.message || "更新失敗");
      }
    } catch (error) {
      alert(`更新失敗: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 修改密碼
  const handleChangePassword = () => {
    // 這裡可以導向密碼修改頁面或開啟密碼修改彈窗
    console.log("修改密碼");
    alert("密碼修改功能開發中...");
  };

  // 刪除帳號
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("確定要刪除帳號嗎？此操作無法復原！");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("reactLoginToken");
      if (!token) {
        throw new Error("請先登入");
      }

      const response = await fetch(`http://localhost:3007/api/users/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("帳號已刪除");
        // 清除本地資料並導向登入頁
        localStorage.removeItem("reactLoginToken");
        setUser(null);
        window.location.href = "/user/login";
      } else {
        throw new Error(result.message || "刪除失敗");
      }
    } catch (error) {
      console.error("刪除帳號失敗:", error);
      alert(`刪除失敗: ${error.message}`);
    }
  };

  if (!user) {
    return <div className="loader"></div>;
  }

  if (user) {
    return (
      <div className="container py-3">
        <Header />
        <Sidebar />

        <div className="main-content">
          <div className="breadcrumb"></div>

          <div id="profile-form" className="form-middle">
            <h1 className="mb-0">會員資料管理</h1>
            <form className="align-self-stretch" onSubmit={handleUpdate}>
              <hr className="line" />

              <div className="row mb-3 mb-md-5">
                <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                  <div className="avatar-wrapper-bg">
                    <div
                      className="avatar-bg"
                      onClick={handleImageClick}
                      style={{ cursor: isEditing ? "pointer" : "default" }}
                    >
                      <img
                        src={
                          formData.img.startsWith("data:")
                            ? formData.img
                            : formData.img
                            ? `/images/users/user-photo/${formData.img}`
                            : "./images/user-photo.jpg"
                        }
                        alt="avatar"
                      />
                      <div
                        className={`camera-bg ${isEditing ? "editing" : ""}`}
                      >
                        <i className="fa-solid fa-camera"></i>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>

                <div className="col-12 col-md-6 d-flex flex-column">
                  <div className="mb-3 mb-md-2">
                    <label className="form-label">帳號</label>
                    <input
                      type="text"
                      className="form-control"
                      name="account"
                      value={formData.account}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="mb-3 mb-md-2">
                    <label className="form-label">信箱</label>
                    <input
                      type="text"
                      className="form-control"
                      name="mail"
                      value={formData.mail}
                      disabled
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="form-label">使用者名稱</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="請輸入使用者名稱"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-4 mb-md-5">
                <div className="col-12 col-md-3">
                  <label className="form-label">電話</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    placeholder="請輸入電話號碼"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label htmlFor="radio1" className="form-label d-block">
                    性別
                  </label>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender_id"
                        id="radio1"
                        value="1"
                        checked={formData.gender_id === "1"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <label className="form-check-label" htmlFor="radio1">
                        男性
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender_id"
                        id="radio2"
                        value="2"
                        checked={formData.gender_id === "2"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <label className="form-check-label" htmlFor="radio2">
                        女性
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender_id"
                        id="radio3"
                        value="3"
                        checked={formData.gender_id === "3"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <label className="form-check-label" htmlFor="radio3">
                        其他
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="input-birthday" className="form-label">
                    生日
                  </label>
                  <div className="row">
                    <div className="col-4">
                      <input
                        type="number"
                        className="form-control"
                        id="input-birthday"
                        name="year"
                        placeholder="西元年份"
                        min="1900"
                        max="2025"
                        value={formData.year}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        className="form-control"
                        name="month"
                        placeholder="月份"
                        min="1"
                        max="12"
                        value={formData.month}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        className="form-control"
                        name="date"
                        placeholder="日期"
                        min="1"
                        max="31"
                        value={formData.date}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-5">
                <div className="col-12 col-md-2">
                  <label className="form-label">縣市</label>
                  <select
                    className="form-select"
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    <option value="1">台北市</option>
                    <option value="2">新北市</option>
                    <option value="3">桃園市</option>
                    <option value="4">台中市</option>
                    <option value="5">台南市</option>
                    <option value="6">高雄市</option>
                    <option value="7">基隆市</option>
                    <option value="8">新竹市</option>
                    <option value="9">嘉義市</option>
                    <option value="10">新竹縣</option>
                    <option value="11">苗栗縣</option>
                    <option value="12">彰化縣</option>
                    <option value="13">南投縣</option>
                    <option value="14">雲林縣</option>
                    <option value="15">嘉義縣</option>
                    <option value="16">屏東縣</option>
                    <option value="17">宜蘭縣</option>
                    <option value="18">花蓮縣</option>
                    <option value="19">台東縣</option>
                    <option value="20">澎湖縣</option>
                    <option value="21">金門縣</option>
                    <option value="22">連江縣</option>
                  </select>
                </div>
                <div className="col-12 col-md-10">
                  <label className="form-label">地址</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="請輸入地址"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <hr className="mb-5" />

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-password me-5"
                  onClick={handleChangePassword}
                  disabled={isEditing}
                >
                  <i className="fa-solid fa-key me-1"></i> 修改密碼
                </button>

                {!isEditing ? (
                  <button
                    type="button"
                    className="btn btn-edit me-5"
                    onClick={handleEdit}
                  >
                    <i className="fa-solid fa-pen-to-square me-1"></i>{" "}
                    編輯個人資料
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="btn btn-success me-3"
                      disabled={isLoading}
                    >
                      <i className="fa-solid fa-check me-1"></i>
                      {isLoading ? "更新中..." : "確認更新"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary me-5"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <i className="fa-solid fa-times me-1"></i> 取消
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn-del"
                  onClick={handleDeleteAccount}
                  disabled={isEditing}
                >
                  <i className="fa-solid fa-trash me-1"></i> 刪除帳號
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
