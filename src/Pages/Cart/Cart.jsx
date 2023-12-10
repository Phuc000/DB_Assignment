// Cart.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header, Footer } from '../../Components';
import { useCart } from '../../Context/CartContext';
import axios from 'axios'; // Import axios for making HTTP requests
import './Cart.css';

const Cart = () => {
  const { state, dispatch } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod ] = useState('Credit Card');
  const lastBillIdRef = useRef(500100);

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

  useEffect(() => {
    // Fetch category-specific data from JSON file based on categoryName
    axios.get(`http://localhost:8080/transaction/last`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Fetched Data:', response.data);
        return response.data;
      })
      .then((data) => {
        console.log('Fetched Data:', data);
        lastBillIdRef.current = data;
      })
      .catch((error) => console.error(`Error fetching ${categoryName} data:`, error));
  }, []);

  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }    

  const handleBuyButtonClick = async () => {
    try {
      const purchaseTime = new Date(); // Get the current time
      // Split the cart items based on StoreID
      const itemsByStore = state.cart.reduce((result, item) => {
        const storeID = item.StoreID;
        if (!result[storeID]) {
          result[storeID] = [];
        }
        result[storeID].push(item);
        return result;
      }, {});

      const newcustomerID = parseInt(getCookie('userID'), 10); // Ensure customerID is an integer

      // Send each store's bill to the backend separately
      const storePromises = Object.entries(itemsByStore).map(async ([storeID, items], index) => {
        const newstoreID = parseInt(storeID, 10); // Ensure storeID is an integer
        let newBillId = lastBillIdRef.current + index + 1;
        console.log(getCookie('userID'));
        console.log(storeID);
        console.log(purchaseTime.toISOString());
        console.log(newBillId);
        // Step 1: Post the bill information
        const response = await axios.post('http://localhost:8080/transaction/', {
          headers: {
            'Content-Type': 'application/json',
          },
          TransactionID: newBillId,
          CustomerID: newcustomerID,
          // cart: items,
          // total: calculateTotalForStore(items),
          DateAndTime: purchaseTime.toISOString(), // Convert to ISO string for consistency
          PaymentMethod: selectedPaymentMethod,
          StoreID: newstoreID,
          // Add other relevant information
        });
        
        // Step 2: Post the NumberOfProductinBill for each item in the bill
      const itemPromises = items.map(async (item) => {
        const response = await axios.post('http://localhost:8080/transaction/items/', {
          headers: {
            'Content-Type': 'application/json',
          },
          TransactionID: newBillId,
          ProductID: item.ProductID,
          StoreID: newstoreID,
          NumberOfProductInBill: item.Quantity, // Assuming quantity is the number of products in the bill
        });

        const response2 = await axios.post('http://localhost:8080/ship/order', {
          headers: {
            'Content-Type': 'application/json',
          },
          TransactionID: newBillId,
        });

        return response.data;
      });

      // Wait for all item transactions to complete
      const itemResponses = await Promise.all(itemPromises);

      return { bill: response.data, items: itemResponses };
      });

      // Wait for all store transactions to complete
      const storeResponses = await Promise.all(storePromises);

      // Clear the cart after a successful purchase
      dispatch({ type: 'CLEAR_CART' });

      // Redirect to a success or confirmation page
    } catch (error) {
      console.error('Error while processing the purchase:', error);
      // Handle error scenarios, e.g., show an error message to the user
    }
  };

  // Helper function to calculate the total for a specific store
  const calculateTotalForStore = (items) => {
    return items.reduce((total, item) => {
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
                    value="Credit Card"
                    checked={selectedPaymentMethod === 'Credit Card'}
                    onChange={handlePaymentMethodChange}
                  />
                  Credit Card
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Debit Card"
                    checked={selectedPaymentMethod === 'Debit Card'}
                    onChange={handlePaymentMethodChange}
                  />
                  Debit Card
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Cash"
                    checked={selectedPaymentMethod === 'Cash'}
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
