import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer, ShowProduct } from "../../Components";
import axios from "axios";

import "./Store.css";

const Store = () => {
  const [products, setProducts] = useState([]);
    const { storeId } = useParams();

    useEffect(() => {
      // Fetch category-specific data from JSON file based on categoryName
      axios.get(`http://localhost:8080/products/store/${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log('Fetched Data:', response.data);
          return response.data;
        })
        .then(async (data) => {
          console.log('Fetched Data:', data);
          const promoProductsData = [];

          for (const product of data) {
            const promotionInfo = await fetchPromotionInfo(product.ProductID);
            promoProductsData.push({
              ...product,
              promotions: promotionInfo,
              totalDiscount: calculateTotalDiscount(promotionInfo),
            });
          }

          setProducts(promoProductsData);
        })
        .catch((error) => console.error(`Error fetching store ${storeId} data:`, error));
    }, [storeId]);

    const fetchPromotionInfo = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:8080/products/promotionfromproduct/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching promotion info for product ${productId}:`, error);
        return [];
      }
    };
  
    const calculateTotalDiscount = (promotions) => {
      if (!promotions || promotions.length === 0) {
        return 0; // No discounts
      }
      const totalDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
      // Ensure the total discount does not exceed 0.99
      return Math.min(totalDiscount, 0.99);
    };

  return (
    <div className="store">
      <Header/>
      <div className="store-content">
      <header className="products__header container">
          <h2 className="subtitle subtitle--products">Store: {storeId}</h2>
        </header>
        <div className="products__container container">
          {products.map((product) => (
            <>
            <ShowProduct product={product} storeId={storeId} />
            </>
          ))}
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Store;