// Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../../Components';
import { useCart } from '../../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useCart();

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.Price * (1 - item.TotalDiscount)) * item.Quantity;
    }, 0);
  };

  return (
    <div className="cart">
      <Header />
      <div className="cart-content">
        <h1 className="cart-title">My Cart</h1>
        {state.cart.length === 0 ? (
          <p className="empty-cart-message">Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {state.cart.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-details">
                  <Link 
                    to={`/buy-product/${item.ProductID}/${item.StoreID}`} 
                    key={item.ProductID}
                    className="product-link"
                  >
                    <p className="item-name">{item.PName}</p>
                  </Link>
                  <p className="item-quantity">Quantity: {item.Quantity}</p>
                  <p className="item-storeid">Store: {item.StoreID}</p>
                  {item.Promotion && item.Promotion.length > 0 ? (
                  <>
                    <p className="promo-product-price">${item.Price.toFixed(2)}</p>
                    <p className="cart_product__disscount_num">{item.TotalDiscount.toFixed(2) * 100}% off</p>
                    <p className="promo-product-discount">Price: ${(item.Price * (1 - item.TotalDiscount)).toFixed(2)}</p>
                  </>
                ) : (
                  <>
                    <p className="item-price">Price: ${item.Price.toFixed(2)}</p>
                  </>
                )}
                  {/* Add other details as needed */}
                </div>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="cart-summary">
              {/* You can display the total or other summary information here */}
              <p>Total: ${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
