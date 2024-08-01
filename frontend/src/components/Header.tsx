import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import CartModal from '../components/CartModal';
import SearchBar from "./SearchBar";
import ProductsList from "./ProductsList";
import { Category } from "../types"

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [qntItems, setQntItems] = useState(0);
  const { isAuthenticated, userLogged, logout } = useAuth();

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (userLogged?.id) {
      fetch(`http://localhost:3001/cart-items/${userLogged.id}`)
        .then(response => response.json())
        .then(data => setQntItems(data.length))
        .catch(error => console.log('Error fetching cart items:', error));
    }
  }, [userLogged])

  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = localStorage.getItem('categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
      } else {
        try {
          const response = await fetch('http://localhost:3001/category/');
          const data: Category[] = await response.json();
          setCategories(data);
          localStorage.setItem('categories', JSON.stringify(data));
        } catch (error) {
          console.log('Error fetching categories:', error);
        }
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <header className="bg-blue_primary flex items-center p-3">
        <a href="/"><img src="/logo.png" alt="logo" /></a>
        <SearchBar placeholder="Encontre o suplemento ideal para você" />
        <img className="w-8 h-8 mr-3" src="/do-utilizador.png" alt="usuario" />
        {isAuthenticated ? (
          <>
            <p className="text-white">Olá, <a href="#"><strong>{userLogged?.name}</strong></a></p>
            <button 
              onClick={logout} 
              className="mx-12 bg-red-500 text-white font-bold rounded focus:outline-none focus:shadow-outline"
            >
              Sair
            </button>
          </>
        ) : (
          <div>
            <p className="text-white">
              <a href="/register"><strong>Cadastre-se</strong></a> ou
            </p>
            <a className="text-white" href="/login"><strong>faça seu login</strong></a>
          </div>
        )}
          <div className="relative cursor-pointer" onClick={() => openModal('cart')}>
          <img className="w-8 h-8 ml-80" src="/carrinho.png" alt="carrinho" />

          <span
            className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 ml-4 text-sm font-bold leading-none text-white bg-black rounded-full">
              {qntItems}
          </span>
        </div>
      </header>

      <header
        className="bg-white shadow-lg-inner flex items-center justify-between p-3 relative"
        style={{ boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="mx-4">
          <a
            href="#"
            className={`text-${activeModal === 'categories' ? 'blue_primary' : 'black'} hover:text-blue_primary flex`}
            onMouseEnter={() => openModal('categories')}
            onMouseLeave={closeModal}
          >
            <img className="w-6 h-6 mr-2" src={`/menu${activeModal === 'categories' ? '2' : ''}.png`} alt="logo" />
            TODAS AS CATEGORIAS
          </a>
        </div>
        <div>
          {categories.map(category => (
            <a className="mx-2 text-gray_200 hover:text-blue_primary" href="#" key={category.id}>
              {category.name}
            </a>
          ))}
        </div>
      </header>
      <div
        onMouseEnter={() => openModal('categories')}
        onMouseLeave={closeModal}
        className="relative"
      >
        {activeModal === 'categories' && (
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
      {activeModal === 'cart' && (
        <CartModal isVisible={true} onClose={closeModal} />
      )}
    </>
  );
}

export default Header;
