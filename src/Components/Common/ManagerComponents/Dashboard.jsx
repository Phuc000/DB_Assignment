import React from "react";
import { useEffect, useState } from "react";
import {ShowProduct } from "../../../Components";
import axios from "axios";
import "./Dashboard.scss";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const storeId = 1;
    const [ store, setStore ] = useState();

    useEffect(() => {
      // Fetch category-specific data from JSON file based on categoryName
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/store/${storeId}`, {
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

      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/store/${storeId}`, {
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
        <div>
            <h1>Dashboard</h1>
            <div className="products__container_2">
                {products.map((product) => (
                    <ShowProduct key={product.ProductID} product={product} storeId={storeId} />
                ))}
            </div>
        </div>
    );

}

export default Dashboard;