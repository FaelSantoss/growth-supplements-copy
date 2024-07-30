import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
}

interface ItemCart {
  id: number;
  quantity: number;
  productId: number;
  cartId: number;
  product: Product;
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CartModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const [itemsCart, setItemsCart] = useState<ItemCart[]>([]);
  const [qntItems, setQntItems] = useState(0);
  const [amount, setAmout] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-slide-left');
  const [shouldRender, setShouldRender] = useState(isVisible);
  const { userLogged } = useAuth();

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
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [userLogged]);

  useEffect(() => {
    const totalQuantity = itemsCart.reduce((total, item) => total + item.quantity, 0);
    setQntItems(totalQuantity);
  }, [itemsCart]);

  useEffect(() => {
    const totalPrice = itemsCart.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    setAmout(totalPrice);
  }, [itemsCart]);

  const handleDelete = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/cart-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setItemsCart(itemsCart.filter(item => item.id !== itemId));
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleIncrement = async (itemId: number) => {
    const item = itemsCart.find(item => item.id === itemId);
    if (item) {
      try {
        const response = await fetch(`http://localhost:3001/cart-items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        });

        if (response.ok) {
          setItemsCart(itemsCart.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
          throw new Error('Failed to increment item quantity');
        }
      } catch (error) {
        console.error('Error incrementing item quantity:', error);
      }
    }
  };

  const handleDecrement = async (itemId: number) => {
    const item = itemsCart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      try {
        const response = await fetch(`http://localhost:3001/cart-items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: item.quantity - 1 }),
        });

        if (response.ok) {
          setItemsCart(itemsCart.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
          throw new Error('Failed to decrement item quantity');
        }
      } catch (error) {
        console.error('Error decrementing item quantity:', error);
      }
    }
  };

  const handleClose = () => {
    setAnimationClass('animate-slide-right');
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setAnimationClass('animate-slide-left');
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div className="relative">
      <div
        id="cart-modal"
        className={`fixed top-0 right-0 h-full w-1/4 bg-white shadow-lg p-4 transition-transform transform ${animationClass}`}
      >
        <h2 className="text-xl text-center font-bold mb-4">Itens no Carrinho ({qntItems})</h2>
        <div className="mb-4">
          <div 
            className="border-2 rounded-sm pt-2 pb-6 pl-2 mb-6 border-gray_100"
            style={{ height: '24.7rem', overflowY: 'auto' }}
          >
            {itemsCart.map((item) => (
              <div key={item.id} className="flex">
                <img
                  src={`/${item.product.imageUrl}`}
                  alt="Produto"
                  className="w-24 h-32 object-cover"
                />
                <div className="ml-4">
                  <div className="flex justify-around">
                    <p className="font-semibold mr-20">{item.product.name}</p>
                    <button onClick={() => handleDelete(item.id)}>
                      <img className="w-4 h-4 ml-10" src="/lixeira.png" alt="lixeira" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <div className="mt-2 mr-24">
                      <button onClick={() => handleDecrement(item.id)}>
                        <img className="w-4 h-4 align-center" src="/menos.png" alt="-" />
                      </button>
                      <input
                        value={item.quantity}
                        className="w-12 text-center border mx-2"
                        readOnly
                      />
                      <button onClick={() => handleIncrement(item.id)}>
                        <img className="w-4 h-4 align-center" src="/mais.png" alt="+" />
                      </button>
                    </div>
                    <p className="text-lg font-bold">R${item.product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border mb-12">
          <p className="font-semibold text-center border border-solid">Resumo do pedido</p>
          <div className="flex justify-between mb-2 p-2">
            <p>Subtotal</p>
            <p>R${amount}</p>
          </div>
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded">
          <a href="/finalizeOrder">Fechar Pedido</a>
        </button>
        <button 
          className="w-full bg-gray-300 text-gray-700 py-2 rounded mt-2"
          onClick={handleClose}
        >
          Escolher mais produtos
        </button>
      </div>
    </div>
  );
};

export default CartModal;
