import React from 'react';
import { useParams } from 'react-router-dom';
import {Header, Footer} from "../../Components";
import "./BuyProduct.css";

const BuyProduct = () => {
    const { productId } = useParams();
  return (
    <div className="buy-product">
      <Header/>
      <div className="buy-product-content">
        <h2>Product Details</h2>
        <p>Product ID: {productId}</p>
    </div>
    <Footer/>
    </div>
  );
};

export default BuyProduct;