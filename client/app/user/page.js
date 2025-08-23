"use client";

import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import UserBtn from "../_components/userBtn";

export default function UserPage() {
  const { list, users } = useAuth();

  useEffect(() => {
    list();
  }, []);

  if (!users.length) {
    return (
      <div className="container py-3">
        <h1>使用者列表頁</h1>
        <h2>沒有使用者資訊</h2>
        <div className="btn btn-primary me-1" onClick={list}>取得使用者列表</div>
        <Link className="btn btn-primary" href="/">
          回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <UserBtn />
      <h1>使用者列表頁</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">account</th>
            <th scope="col">mail</th>
            <th scope="col">head</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={`user${index}`}>
              <th scope="row">{index + 1}</th>
              <td>{user.account}</td>
              <td>{user.mail}</td>
              <td>
                <Link href={`/user/${user.account}`}>
                  <Image src={user.head} width={50} height={50} style={{ objectFit: "contain" }} alt="" />
                </Link>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
      {/* <div className="btn btn-primary me-1" onClick={list}>取得使用者列表</div> */}
      <Link className="btn btn-primary" href="/user">
        回首頁
      </Link>
    </div>
  );
}
