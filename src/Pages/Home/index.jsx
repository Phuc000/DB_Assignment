import React, { useEffect, useState } from 'react';
import {Header, Footer} from "../../Components";
import "./Home.css";
const Home = () => {
  const [currentAd, setCurrentAd] = useState(1);

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

  return (
    <div className="home">
      <Header/>
      <div className="content-section">

        <section class="hero">
            <div class="hero__content">
                <img src="/Images/logo.png" alt="Shop house logo" class="hero__logo" />
                <p class="hero__text">
                    Over 30 years of experience giving our customers the products at the best price.
                </p>
                <a href="#catContainer"><button class="btn btn--black btn--hero">Take a look of our categories</button></a>
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
        <div className="catContainer container" id="catContainer">
          <section className="bannerCategories">
            <h2 className="subtitle subtitle--cat">OUR CATEGORIES</h2>
          </section>
          <div className="circlesContainer">
            {categories.map((category) => (
              <div className="circle" key={category.name}>
                <a href={category.link}>
                  <img src={category.image} className="imgRounded" alt={category.name} />
                </a>
                <div className="circleBody">
                  <a href={category.link} className="a__catContainer">
                    <h3 className="descripCateg">{category.name}</h3>
                  </a>
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
