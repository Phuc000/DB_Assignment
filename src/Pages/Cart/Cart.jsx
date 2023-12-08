import React from 'react';
import { Header, Footer } from '../../Components';
import { useCart } from '../../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { state } = useCart();

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        <h1>My Cart</h1>
        {state.cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {state.cart.map((item, index) => (
              <div key={index} className="cart-item">
                <p>{item.productName}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price.toFixed(2)} USD</p>
                {/* Add other details as needed */}
              </div>
            ))}
            {/* Display total or other summary information */}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
