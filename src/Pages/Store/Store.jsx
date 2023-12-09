import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer} from "../../Components";
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
        .then((data) => {
          console.log('Fetched Data:', data);
          setProducts(data);
        })
        .catch((error) => console.error(`Error fetching store ${storeId} data:`, error));
    }, [storeId]);

  return (
    <div className="store">
      <Header/>
      <div className="store-content">
      <header className="products__header container">
          <h2 className="subtitle subtitle--products">Store: {storeId}</h2>
        </header>
        <div className="products__container container">
          {products.map((product) => (
            <Link
            to={`/buy-product/${product.ProductID}`}
            key={product.ProductID}
            className="product-link"
          >
            <article className="product-card" key={product.PName}>
              <div className="product-card__image-container">
                {/* <img src={product.image} alt={product.name} /> */}
                {/* {product.discount && <p className="product__disscount">{product.discount}% off</p>} */}
              </div>

              <div className="product-card__body">
                <p className="product-card__name">{product.PName}</p>
                <p className="product-card__price">Price: {product.Price.toFixed(2)} <span>usd</span></p>

                <div className="product-card__buttons">
                  <button className="btn btn--secondary">Buy</button>
                  <button className="btn btn--secondary--transparent">Details</button>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Store;