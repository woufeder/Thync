"use client"
import BrandBox from "./brandBox";
import styles from "@/styles/brand.css";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";


export default function BrandsPage() {


  return (
    <>
      <header>
        <Header />
      </header>

      <div >
        <div>
          <BrandBox />
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </>
  )
}

