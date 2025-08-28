import CartHeader from "@/app/_components/cart/cartHeader";
import CartSteps from "@/app/_components/cart/cartSteps";
import RecommendList from "@/app/_components/cart/recommendList";
import Header from "../_components/header";
import Footer from "../_components/footer";

import CartListPage from "./cartListPage";
import EmptyCartPage from "./emptyCart";

export default async function CartPage() {
  // 假資料，未來可從 API / DB 取得
  const items = [];
  const recommend = Array(6).fill({
    img: "https://picsum.photos/id/1058/600/400",
    title: "A4tech 雙飛燕 Bloody S98",
    price: "$2390",
  });

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <CartHeader />
        <CartSteps active={0} />
        {items.length === 0 ? (
          <EmptyCartPage />
        ) : (
          <CartListPage items={items} recommend={recommend} />
        )}
        <RecommendList items={recommend} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
