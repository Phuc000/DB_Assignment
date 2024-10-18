import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Header, Footer, ShowProduct } from "../../Components";
import FeatureAd from '../../Components/Common/Feature_Ad/FeatureAd';
import axios from "axios";

import "./Store.css";

const Store = () => {
  const [products, setProducts] = useState([]);
    const { storeId } = useParams();
    const [ store, setStore ] = useState();

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

      axios.get(`http://localhost:8080/store/${storeId}`, {
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
          setStore(data);
        })
        .catch((error) => console.error(`Error fetching store ${storeId} data:`, error));
    }, [storeId]);

  return (
    <div className="store">
      <Header/>
      <div className="store-content">
      <header className="products__header container">
        {store?.Name && <h2 className="subtitle subtitle--products">{store.Name}</h2>}
        </header>
        <div className="products__container container">
          {products.map((product) => (
            <>
            <ShowProduct product={product} storeId={storeId} />
            </>
          ))}
        </div>
      </div>
      <FeatureAd />
    <Footer/>
    </div>
  );
};

export default Store;