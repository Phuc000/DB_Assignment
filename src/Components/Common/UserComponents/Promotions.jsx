import React, { useState } from "react";
import axios from "axios";

const Promotions = () => {
    const [promotion, setpromotion] = useState([]);

    function getCookie(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
      
        for (let i = 0; i < cookieArray.length; i++) {
          let cookie = cookieArray[i].trim();
          if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
          }
        }
        return null;
      }

    const submitloginForm = async () => {
        axios.get('http://localhost:8080/promotion/',{
            headers: {
              "Content-Type": "application/json",
          },
          })
            .then((response) => {
              console.log('Fetched Cookie:', response.data);
              return response.data;
            })
            .then((data) => {
              console.log('Fetched data:', data);
              setpromotion(data);
            })
            .catch((error) => console.error(`Error fetching promotions data:`, error));
    }


    useState(() => {
        if (getCookie("userID")) {
          submitloginForm();
        }
      }, []);

    return (
      <div>
        <h1>Promotions</h1>
        <p>Check out our latest promotions!</p>
        <div>Your Promotions:</div>
            <ul className="ul_promo_list">
              {promotion.map((promotion) => (
                <li key={promotion.promotionID} className="promo_list">
                  <div>Promotion ID: {promotion.PromotionID}</div>
                  <div>Promotion Name: {promotion.Name}</div>
                  {/* Add other promotion details you want to display */}
                </li>
              ))}
            </ul>
      </div>
    );
}

export default Promotions;