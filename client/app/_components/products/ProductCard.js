"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'


export default function ProductCard({ p }) {
  const router = useRouter()

  return (
    <>



      <div className="product-card">
        <div className="card-img">
          <Link key={p.id} href={`/products/${p.id}`}>
            <img
              src={
                p.first_image
                  ? `/images/products/uploads/${p.first_image}`
                  : "/images/no-image.jpg"
              }
              alt={p.name}
            />
          </Link>
        </div>
        <div className="card-body">
          <p className="card-title">{p.name}</p>
          <div className="card-bottom">
            <p className="price">${p.price}</p>
            <button className="btn btnCart" onClick={() => router.push(`/cart`)}>
              <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        </div>

      </div>
    </>

  )
}