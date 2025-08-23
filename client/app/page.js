'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import Header from "./_components/header";

export default function Home() {

    return (
        <div className="container py-3">
            <Header />
        </div>
    );

}