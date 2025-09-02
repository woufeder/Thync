import { brandData } from "./brandsData";

export default function BrandBox() {
  return (
    <>
      {Object.entries(brandData).map(([letter, items]) => (
        <div key={letter} className="brand-row">
          <div className="brand-letter">{letter}</div>
          <div className="brand-items">
            {items.map((brand, idx) => (
              <div key={idx} className="brand-item">
                <div className="brand-img">
                  <img src={brand.logo} alt={brand.name} />
                </div>
                <p>{brand.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>


  );
}
