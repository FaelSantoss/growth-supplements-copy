import { useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product: { name, imageUrl, price, description } }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
  };

  const handleSubmit = () => {
    navigate(`/product/${name}`)
  }

  return (
    <div 
      className="border rounded-lg p-10 w-96 shadow-lg m-2"
      onMouseEnter={openModal}
      onMouseLeave={closeModal}
    >
      <img src={imageUrl} alt={name} className="w-full h-96 object-cover" />
      <h2 className="mt-4 text-center text-lg">{name}</h2>
      <p className="text-center text-gray_200 text-sm">{description}</p>
      <div className="mt-2 text-center h-16 flex items-center justify-center">
        {!showModal && (
          <span className="text-2xl m-4 font-semibold">R${price.toFixed(2)}</span>
        )}
        {showModal && (
          <button 
          onClick={handleSubmit} 
          className="bg-green_300 text-white font-semibold py-2 w-full">
            COMPRAR
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
