// Cart.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../../Components';
import { useCart } from '../../Context/CartContext';
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');

  const handleRemoveItem = (index) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index });
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.Price * (1 - item.TotalDiscount)) * item.Quantity;
    }, 0);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleBuyButtonClick = async () => {
    try {
      // const purchaseTime = new Date(); // Get the current time
      // You can customize the endpoint and headers based on your backend requirements
      // const response = await axios.post('http://localhost:8080/transaction/', {
      //   cart: state.cart,
      //   total: calculateTotal(),
      // purchaseTime: purchaseTime.toISOString(), // Convert to ISO string for consistency
      //   paymentMethod: selectedPaymentMethod,
      // });

      // Clear the cart after a successful purchase
      dispatch({ type: 'CLEAR_CART' });

      // Redirect to a success or confirmation page
    } catch (error) {
      console.error('Error while processing the purchase:', error);
      // Handle error scenarios, e.g., show an error message to the user
    }
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
                  <p className="item-storeid">Store: {item.StoreName}</p>
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
            <div className="payment-method">
              <h3>Choose Payment Method:</h3>
              <div>
                <label>
                  <input
                    type="radio"
                    value="creditCard"
                    checked={selectedPaymentMethod === 'creditCard'}
                    onChange={handlePaymentMethodChange}
                  />
                  Credit Card
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="debitCard"
                    checked={selectedPaymentMethod === 'debitCard'}
                    onChange={handlePaymentMethodChange}
                  />
                  Debit Card
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="cash"
                    checked={selectedPaymentMethod === 'cash'}
                    onChange={handlePaymentMethodChange}
                  />
                  Cash
                </label>
              </div>
            </div>
            <div className="cart-summary">
              {/* You can display the total or other summary information here */}
              <p>Total: ${calculateTotal().toFixed(2)}</p>
            </div>
            <button className="buy-button" onClick={handleBuyButtonClick}>
              Buy
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
