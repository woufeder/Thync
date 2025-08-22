'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Login from "./_components/login";
import Logout from "./_components/logout";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {

    return (
      <div className="container">
        Loading......
      </div>
    );
  }

  return (
    <div className="container">
      {user ? <Login /> : <Logout />}
    </div>
  );
}