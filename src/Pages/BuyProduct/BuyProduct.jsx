import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Footer } from "../../Components";
import { useCart } from '../../Context/CartContext';
import "./BuyProduct.css";

const BuyProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productAtStore, setproductAtStore] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const { dispatch } = useCart();

  useEffect(() => {
    // Fetch product details based on the productId
    fetch(`/assets/products.json`)
      .then((response) => response.json())
      .then((data) => {
        // Find the product with the matching productId
        const selectedProduct = data.find((p) => p.productId === parseInt(productId));
        setProduct(selectedProduct);
      })
      .catch((error) => console.error(`Error fetching product data:`, error));

      // Fetch additional information based on the productId
    fetch(`/assets/at.json`)
      .then((response) => response.json())
      .then((data) => {
        // Find the additional info with the matching productId
        const selectedInfo = data.find((info) => info.productId === parseInt(productId));
        setproductAtStore(selectedInfo);
      })
      .catch((error) => console.error(`Error fetching additional info data:`, error));
  }, [productId]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    const maxQuantity = productAtStore ? productAtStore.stock : 1;
    setQuantity(newQuantity > 0 ? Math.min(newQuantity, maxQuantity) : 1);
  };

  const handleAddToCart = () => {
    // Implement your add to cart logic here
    const purchaseInfo = {
      productId: product.productId,
      productName: product.productName,
      quantity: quantity,
      price: product.price,
      // Add other relevant info
    };

    dispatch({ type: 'ADD_TO_CART', payload: purchaseInfo });
    console.log(`Added ${quantity} ${product.productName} to the cart.`);
  };

  return (
    <div className="buy-product">
      <Header />
      <div className="buy-product-content">
        {product && productAtStore ? (
          <>
            
            <h2 className="product-name">{product.productName} Details</h2>
            <div className='info'>
              <div className="product-info">
                <p>Product ID: {product.productId}</p>
                <p>Product Name: {product.productName}</p>
                <p>Category: {product.category}</p>
                <p>Description: {product.description}</p>
                <p>Price: {product.price.toFixed(2)} USD</p>
              </div>
              {/* Add more details as needed */}
              {/* Additional Information */}
              <div className="provider">
                {/* Use Link to navigate to the Store page with productId */}
                <Link to={`/Store/${productAtStore.providerId}`}>
                  <p>Provider ID: {productAtStore.providerId}</p>
                </Link>
                <p>Stock: {productAtStore.stock}</p>
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
