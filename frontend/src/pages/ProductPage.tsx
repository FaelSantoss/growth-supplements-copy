import React, { useEffect, useState } from 'react';
import CartModal from '../components/CartModal';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Product, ItemCart } from "../types"

const ProductPage: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [itemsCart, setItemsCart] = useState<ItemCart[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const { userLogged } = useAuth();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    if (userLogged?.id) {
      fetch(`http://localhost:3001/cart-items/${userLogged.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())
      .then((data: ItemCart[]) => setItemsCart(data))
      .catch((error) => console.error("Error fetching cart items:", error));
    }
  }, [userLogged]);

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

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    const itemInCart = itemsCart.find(item => item.product.id === product?.id);

    if (itemInCart) {
      openModal();
    } else {
      try {
        const response = await fetch('http://localhost:3001/cart-items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: 1, productId: product?.id, userId: userLogged?.id }),
        });

        if (response.ok) {
          openModal();
        } else {
          throw new Error('Add item to cart failed');
        }
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    }
  };

  return (
    <>
      <Header />
      {isModalVisible && (
        <CartModal isVisible={isModalVisible} onClose={closeModal} />
      )}
      {product ? (
        <div className="flex justify-center p-10 shadow-lg bg-gray_50">
          <img src={`/${product.imageUrl}`} alt={product.name} className="h-96 object-cover" />
          <div className='text-center flex flex-col justify-around'>
            <div className='text-white'>
              <h2 className="mt-4 text-center text-lg font-bold uppercase">{product.name}</h2>
              <p className="text-center text-sm">{product.description}</p>
            </div>
            <div className=''>
              <span className="text-2xl m-4 font-semibold">R${product.price.toFixed(2)}</span>
              <button
                className="bg-green_300 text-white font-semibold w-full p-2 flex justify-center items-center m-3"
                onClick={handleSubmit}
              >
                <a className='w-3/4'>COMPRAR</a>
                <img className="h-8 w-8" src="/adicionar-ao-carrinho.png" alt="" />
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
