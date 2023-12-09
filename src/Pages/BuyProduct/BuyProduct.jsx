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
  const { dispatch } = useCart();

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

      // Fetch additional information based on the productId
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

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.NumberAtStore : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Implement your add to cart logic here
    const purchaseInfo = {
      ProductID: product.ProductID,
      PName: product.PName,
      Quantity: quantity,
      Price: product.Price,
      StoreID: productAtStore.StoreID
      // Add other relevant info
    };

    dispatch({ type: 'ADD_TO_CART', payload: purchaseInfo });
    console.log(`Added ${quantity} ${product.PName} to the cart.`);
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
                <p>Price: {product.Price.toFixed(2)} USD</p>
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
