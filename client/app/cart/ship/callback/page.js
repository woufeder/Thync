"use client";

import { useShip711StoreCallback } from "@/hooks/use-ship-711-store";

export default function CallbackPage() {
  useShip711StoreCallback();
  return <p>處理中，請稍候…</p>;
}