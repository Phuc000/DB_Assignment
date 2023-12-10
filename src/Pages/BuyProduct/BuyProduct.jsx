import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Footer } from "../../Components";
import { useCart } from '../../Context/CartContext';
import axios from "axios";
import "./BuyProduct.css";

const BuyProduct = () => {
  const { productId, storeId } = useParams();
  const [product, setProduct] = useState(null);
  const [productAtStore, setproductAtStore] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [promotions, setPromotions] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const { state, dispatch } = useCart();

  useEffect(() => {
    // Fetch product details based on the productId
    axios.get(`http://localhost:8080/products/${productId}`, {
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
        setProduct(data);
      })
      .catch((error) => console.error(`Error fetching product ${productId} data:`, error));

      // Fetch additional information: number at store based on the productId
      axios.get(`http://localhost:8080/products/productatstore/${productId}/${storeId}`, {
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
          setproductAtStore(data);
        })
        .catch((error) => console.error(`Error fetching product ${productId} data:`, error));
  }, [productId]);

  // Fetch additional information: promotion based on the productId
  useEffect(() => {
    const fetchPromotionInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/products/promotionfromproduct/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const promotionInfo = response.data;
        setPromotions(promotionInfo);
        setTotalDiscount(calculateTotalDiscount(promotionInfo));
      } catch (error) {
        console.error(`Error fetching promotion info for product ${product.ProductID}:`, error);
      }
    };

    fetchPromotionInfo();
  }, [productId]);

  const calculateTotalDiscount = (promotions) => {
    if (!promotions || promotions.length === 0) {
      return 0; // No discounts
    }
    const totalDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
    // Ensure the total discount does not exceed 0.99
    return Math.min(totalDiscount, 0.99);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.NumberAtStore : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Check if the product already exists in the cart
    const existingCartItem = state.cart.find(
      (item) => item.ProductID === product.ProductID && item.StoreID === productAtStore.StoreID
    );
  
    if (existingCartItem) {
      // If the product exists, calculate the new quantity
      const newQuantity = existingCartItem.Quantity + quantity;
  
      // Check if the new quantity exceeds the available stock
      if (newQuantity > productAtStore.NumberAtStore) {
        console.error("Error: Quantity exceeds available stock.");
        return; // Prevent adding to cart if quantity exceeds stock
      }
  
      // Update the quantity of the existing item in the cart
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { ...existingCartItem, Quantity: newQuantity } });
      console.log(`Updated quantity of ${product.PName} in the cart: ${newQuantity}`);
    } else {
      // If the product does not exist, add it to the cart
      const purchaseInfo = {
        ProductID: product.ProductID,
        PName: product.PName,
        Quantity: quantity,
        Price: product.Price,
        StoreID: productAtStore.StoreID,
        Promotion: promotions,
        TotalDiscount: totalDiscount
        // Add other relevant info
      };
  
      // Add the new item to the cart
      dispatch({ type: 'ADD_TO_CART', payload: purchaseInfo });
      console.log(`Added ${quantity} ${product.PName} to the cart.`);
    }
  };  

  return (
    <div className="buy-product">
      <Header />
      <div className="buy-product-content">
        {product && productAtStore ? (
          <>
            
            <h2 className="product-name">{product.PName} Details</h2>
            <div className='info'>
              <div className="product-info">
                <p>Product ID: {product.ProductID}</p>
                <p>Product Name: {product.PName}</p>
                <p>Category: {product.Category}</p>
                <p>Description: {product.Description}</p>
                {promotions && promotions.length > 0 ? (
                  <>
                    <p className="promo-product-price">${product.Price.toFixed(2)}</p>
                    <p className="product__disscount_num">{totalDiscount.toFixed(2) * 100}% off</p>
                    <p className="promo-product-discount">${(product.Price * (1 - totalDiscount)).toFixed(2)}</p>
                  </>
                ) : (
                  <>
                    <p className="product-card__price">${product.Price.toFixed(2)}</p>
                  </>
                )}
              </div>
              {/* Add more details as needed */}
              {/* Additional Information */}
              <div className="provider">
                {/* Use Link to navigate to the Store page with productId */}
                <Link to={`/Store/${productAtStore.StoreID}`}>
                  <p>Store: {productAtStore.StoreID}</p>
                </Link>
                <p>Stock: {productAtStore.NumberAtStore}</p>
              {/* Add more details as needed */}
              </div>
            </div>
            {/* Quantity Input */}
            <div className="quantity-input">
              <label htmlFor="quantity">Enter Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
              />
            </div>
            {/* Add to Cart Button */}
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyProduct;
