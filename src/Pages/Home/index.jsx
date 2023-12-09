import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Header, Footer, ShowProduct } from "../../Components";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [currentAd, setCurrentAd] = useState(1);
  const [stores, setStores] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
        // Change the ad every 0.5 seconds
        setCurrentAd((prevAd) => (prevAd % 4) + 1);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
      // Fetch categories from your JSON file or backend API
      fetch("/assets/categories.json")
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
      axios.get("http://localhost:8080/store/", {
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
          setStores(data);
        })
        .catch((error) => console.error(`Error fetching store data:`, error));
    }, []);

    useEffect(() => {
      axios.get("http://localhost:8080/products/promotion/", {
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
          const uniqueProducts = data.reduce((unique, product) => {
            if (!unique.find((p) => p.ProductID === product.ProductID)) {
              return [...unique, product];
            }
            return unique;
          }, []);
          const promoProductsData = [];

          for (const product of uniqueProducts) {
            const promotionInfo = await fetchPromotionInfo(product.ProductID);
            promoProductsData.push({
              ...product,
              promotions: promotionInfo,
              totalDiscount: calculateTotalDiscount(promotionInfo),
            });
          }

          setPromoProducts(promoProductsData);
        })
        .catch((error) => console.error(`Error fetching store data:`, error));
    }, []);

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
      const totalDiscount = promotions.reduce((total, promotion) => total + promotion.Discount, 0);
      // Ensure the total discount does not exceed 0.99
      return Math.min(totalDiscount, 0.99);
    };

  return (
    <div className="home">
      <Header/>
      <div className="content-section">

        <section className="hero">
            <div className="hero__content">
                <img src="/Images/logo.png" alt="Shop house logo" className="hero__logo" />
                <p className="hero__text">
                    Over 30 years of experience giving our customers the products at the best price.
                </p>
                <a href="#catContainer"><button className="btn btn--black btn--hero">Take a look of our categories</button></a>
            </div>
        </section>
        <br/>
        <section className="bannerblock">
          <div id="banner">
            <img
              src={`/Images/bg_desktop.jpg`}
              alt="Ad 1"
              style={{ opacity: currentAd === 1 ? 1 : 0 }}
            />
            <img
              src={`/Images/logo.png`}
              alt="Ad 2"
              style={{ opacity: currentAd === 2 ? 1 : 0 }}
            />
            <img
              src={`/Images/items/technology/monitor_dell.png`}
              alt="Ad 3"
              style={{ opacity: currentAd === 3 ? 1 : 0 }}
            />
            <img
              src={`/Images/items/drinks/cocaCola_pack.png`}
              alt="Ad 4"
              style={{ opacity: currentAd === 4 ? 1 : 0 }}
            />
          </div>
        </section>
        
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

        <div className="promo-products">
        <h2 className="promo-products-title">Featured Promotion Products</h2>
        <div className="promo-products-container">
          {promoProducts.map((product) => (
            <>
            <ShowProduct product={product} storeId={null} />
            </>
          ))}
        </div>
      </div>
        
        {/* Display stores horizontally */}
        <div className='stores'>
          <h2 className="store--cat">OUR STORES</h2>
          <div className="stores-container">
            {stores.map((store) => (
              <Link to={`/store/${store.StoreID}`} key={store.StoreID} className="store-link">
                <div className="store-card">
                  <h3>{store.Name}</h3>
                  <p>{store.Location}</p>
                  <p>Contact: {store.ContactInfo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="catContainer container" id="catContainer">
          <section className="bannerCategories">
            <h2 className="subtitle subtitle--cat">OUR CATEGORIES</h2>
          </section>
          <div className="circlesContainer">
            {categories.map((category) => (
              <div className="circle" key={category.name}>
                <Link to={`/Category/${category.name}`}>
                  <img src={category.image} className="imgRounded" alt={category.name} />
                </Link>
                <div className="circleBody">
                  <Link to={`/Category/${category.name}`} className="a__catContainer">
                    <h3 className="descripCateg">{category.name}</h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
