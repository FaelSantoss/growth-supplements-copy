import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
}

const ProductPage: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productName) {
      fetch(`http://localhost:3001/products/${productName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((data) => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [productName]);
  return (
    <>
    <Header />
    {product ? (
    <div 
      className="flex justify-center p-10 shadow-lg bg-gray_50"
    >
      <img src={`../public/${product.imageUrl}`} alt={product.name} className="h-96 object-cover" />
    <div className='text-center flex flex-col justify-around'>
    <div className='text-white'>
      <h2 className="mt-4 text-center text-lg font-bold uppercase">{product.name}</h2>
      <p className="text-center text-sm">{product.description}</p>
    </div>
    <div className=''>
          <span className="text-2xl m-4 font-semibold">R${product.price.toFixed(2)}</span>
          <button
          className="bg-green_300 text-white font-semibold w-full p-2 flex justify-center items-center m-3">
            <a className='border-r-2 border-green_800 w-3/4'>COMPRAR</a>
            <img className="h-10 w-1/4" src="../public/adicionar-ao-carrinho.png" alt="" />
          </button>
    </div>
    </div>
    </div>
          ) : (
            <p>Loading...</p>
          )}
    </>
  );
}

export default ProductPage;
