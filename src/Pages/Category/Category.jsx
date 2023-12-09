import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer, ShowProduct } from "../../Components";
import "./Category.css";
import axios from "axios";
const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch category-specific data from JSON file based on categoryName
    axios.get(`http://localhost:8080/products/category/${categoryName}`, {
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
            <>
            <ShowProduct product={product} storeId={null} />
            </>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
  };
  
  export default Category;
  