import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
}

interface ProductsListProps {
  categoryName: string;
}

const ProductsList: React.FC<ProductsListProps> = ({ categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryName) {
      fetch('http://localhost:3001/products/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName })
      })
        .then(response => response.json())
        .then((data: Product[]) => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
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
