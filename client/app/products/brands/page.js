"use client"
import BrandBox from "./brandBox";
import styles from "@/styles/brand.css";
import Header from "@/app/_components/header";
import Breadcrumb from "@/app/_components/breadCrumb"
import Footer from "@/app/_components/footer";


export default function BrandsPage() {


  return (
    <>
      <header>
        <Header />
      </header>

      <div className="container">
        <Breadcrumb />
        <div>
          <BrandBox />
        </div>
      </div>

      <Footer />
    </>
  )
}

