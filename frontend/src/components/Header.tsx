import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ProductsList from "./ProductsList";

interface Category {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const openModal = () => {
    clearTimeout(timeoutId);
    setShowModal(true);
  };

  const closeModal = () => {
    timeoutId = setTimeout(() => {
      setShowModal(false);
    }, 200);
  };

  useEffect(() => {
    fetch('http://localhost:3001/category/')
      .then(response => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch(error => console.log('Error fetching categories:', error));
  }, []);

  return (
    <>
      <header className="bg-blue_primary flex items-center p-3">
        <img src="/logo.png" alt="logo" />
        <SearchBar placeholder="Encontre o suplemento ideal para você" />
        <img className="w-8 h-8 mr-3" src="/do-utilizador.png" alt="usuario" />
        <div>
          <p className="text-white">
            <a href="#"><strong>Cadastre-se</strong></a> ou
          </p>
          <a className="text-white" href="#"><strong>faça seu login</strong></a>
        </div>
        <img className="w-8 h-8 ml-80" src="/carrinho.png" alt="carrinho" />
      </header>
      <header
        className="bg-white shadow-lg-inner flex items-center justify-between p-3 rounded-lg relative"
        style={{ boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.1)' }}
      >
        {!showModal && (
          <div className="mx-4">
            <a
              href="#"
              className="text-black hover:text-blue_primary flex"
              onMouseEnter={openModal}
              onMouseLeave={closeModal}
            >
              <img className="w-6 h-6 mr-2" src="/menu.png" alt="logo" />
              TODAS AS CATEGORIAS
            </a>
          </div>
        )}
        {showModal && (
          <div className="mx-4">
            <a
              href="#"
              className="text-blue_primary flex"
              onMouseEnter={openModal}
              onMouseLeave={closeModal}
            >
              <img className="w-6 h-6 mr-2" src="/menu2.png" alt="logo" />
              TODAS AS CATEGORIAS
            </a>
          </div>
        )}
        <div>
          {categories.map(category => (
            <a className="mx-2 text-gray_200  hover:text-blue_primary" href="#" key={category.id}>
              {category.name}
            </a>
          ))}
        </div>
      </header>
      <div
        onMouseEnter={openModal}
        onMouseLeave={closeModal}
        className="relative"
      >
        {showModal && (
          <div 
            className="bg-white p-4 shadow-lg absolute w-11/12 left-1/2 transform -translate-x-1/2 z-50 flex flex-wrap">
            {categories.map(category => (
              <div key={category.id} className="w-full md:w-1/3 p-2">
                <strong className="text-blue_primary hover:underline">{category.name}</strong>
                <ProductsList categoryName={category.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
