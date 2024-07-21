import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/products/')
      .then(response => response.json())
      .then((data) => setProducts(data))
      .catch(error => console.log('Error fetching categories:', error));
  }, []);

  return (
    <>
      <Header />
      <img className="w-full" src="packwheydesk.jpg" alt="" />
      <div className="flex justify-center items-center border-2 rounded-lg border-gray_100 my-14 mx-4">
        <h1 className="text-3xl font-bold p-12">Conheça os suplementos que transformarão seus resultados</h1>
      </div>
      <div className="p-4 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
