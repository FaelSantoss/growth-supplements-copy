import React, { useEffect, useState } from 'react';
import { Product } from "../types"

interface ProductsListProps {
  categoryName: string;
}

const ProductsList: React.FC<ProductsListProps> = ({ categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryName) {
    const cachedProducts = localStorage.getItem(`products_${categoryName}`)
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts))
    } else {
      fetch('http://localhost:3001/products/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName })
      })
        .then(response => response.json())
        .then((data: Product[]) => {
          setProducts(data)
          localStorage.setItem(`products_${categoryName}`, JSON.stringify(data))
        })
        .catch(error => console.error('Error fetching products:', error));
    }
    }
  }, [categoryName]);

  return (
    <div>
      {products.map(product => (
        <div key={product.id} className="product-item">
          <a href="#" className="text-gray_200 hover:underline">{product.name}</a>
        </div>
      ))}
    </div>
  );
}

export default ProductsList;
