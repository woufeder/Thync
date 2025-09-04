import CouponArea from "../_components/coupons/CouponArea";
import Header from "../_components/header";
import Footer from "../_components/footer";
import HeaderUser from "../_components/headerUser";

export default function CouponPage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <aside>
        <HeaderUser />
      </aside>
      <CouponArea />
      <footer>
        <Footer />
      </footer>
    </>
  );
}
