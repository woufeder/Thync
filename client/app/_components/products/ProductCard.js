"use client"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faPlus } from '@fortawesome/free-solid-svg-icons'


export default function ProductCard({ p }) {
  const router = useRouter()

  return (
    <>
      <div className="product-card">
        <div
          className="card-img"
          style={{ cursor: "pointer" }}
          onClick={() => window.location.href = `/products/${p.id}`}
        >
          <img
            src={
              p.first_image
                ? `/images/products/uploads/${p.first_image}`
                : "/images/no-image.jpg"
            }
            alt={p.name}
          />
        </div>
        <div className="card-body">
          <div
            className="card-title"
            style={{ cursor: "pointer" }}
            onClick={() => window.location.href = `/products/${p.id}`}
          >
            {p.name}
          </div>
          <div className="card-bottom">
            <p className="price">${p.price}</p>
            <button className="btn btnCart" onClick={() => router.push(`/cart`)}>
              <FontAwesomeIcon icon={faPlus} />
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        </div>

      </div>
    </>

  )
}