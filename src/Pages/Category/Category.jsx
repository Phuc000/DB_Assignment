import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer} from "../../Components";
import "./Category.css";

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch category-specific data from JSON file based on categoryName
    fetch(`/assets/${categoryName.toLowerCase()}.json`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(`Error fetching ${categoryName} data:`, error));
  }, [categoryName]);

  return (
    <div className="category">
      <Header/>
      <div className="category-content">
        <header className="products__header container">
          <h2 className="subtitle subtitle--products">{categoryName} category:</h2>
        </header>
        <div className="products__container container">
          {products.map((product) => (
            <Link
            to={`/buy-product/${product.id}`}
            key={product.id}
            className="product-link"
          >
            <article className="product-card" key={product.name}>
              <div className="product-card__image-container">
                <img src={product.image} alt={product.name} />
                {product.discount && <p className="product__disscount">{product.discount}% off</p>}
              </div>

              <div className="product-card__body">
                <p className="product-card__name">{product.name}</p>
                <p className="product-card__price">Price: {product.price.toFixed(2)} <span>usd</span></p>

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
  
  export default Category;
  