import React from "react";

export interface ProductCardProps {
  id: number;
  name: string;
  desc?: string;
  price: number;
  image?: string;
  onAdd?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, desc, price, image, onAdd }) => {
  return (
    <div className="card h-100 shadow-sm">
      {image && <img src={image} className="card-img-top" alt={name} />}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        {desc && <p className="card-text text-muted small">{desc}</p>}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="fw-bold">₹{price.toFixed(2)}</div>
          <button className="btn btn-sm btn-danger" onClick={() => onAdd?.(id)}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
