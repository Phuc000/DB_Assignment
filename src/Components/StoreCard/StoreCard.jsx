import React from 'react';
import './StoreCard.scss';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
  return (
    <Link to={`/store/${store.StoreID}`} className="store-link">
      <div className="store-card">
        <div className="store-card-header">
          <div className="store-logo">
            <img src="/Images/no-image.jpg" alt={`${store.Name} logo`} />
          </div>
          <div className="store-details">
            <h3>{store.Name}</h3>
            <p className="store-rating">⭐⭐⭐⭐⭐ (5.0)</p>
            {/* <p className="store-category">Mall</p> */}
          </div>
        </div>
        <div className="store-info">
          <p className="store-address">
            Address: {store.Location}
          </p>
          <p className="store-contact">
            Call Us: {store.ContactInfo}
          </p>
        </div>
        <div className="store-products">
          <button className="store-btn">Visit Store ➔</button>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
