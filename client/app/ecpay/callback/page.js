"use client";

import { useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();

  // 把 query string 全部抓出來
  const entries = Array.from(searchParams.entries());

  return (
    <div style={{ padding: "20px" }}>
      <h1>付款完成回傳結果</h1>
      {entries.length === 0 ? (
        <p>目前沒有參數</p>
      ) : (
        <ul>
          {entries.map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
