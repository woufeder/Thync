import CouponArea from "../_components/coupons/CouponArea";
import Header from "../_components/header";
import Footer from "../_components/footer";

export default function CouponPage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <CouponArea />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
