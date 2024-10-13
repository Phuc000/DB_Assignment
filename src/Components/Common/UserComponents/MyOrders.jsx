import React, { useState } from "react";
import axios from "axios";

const MyOrders = () => {
    const [transaction, settransaction] = useState([]);

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
        axios.get(`http://localhost:8080/customers/shipping/${getCookie('userID')}`, {
            headers: {
              'Content-Type': 'application/json',
            },
        })
          .then((response) => {
            console.log('Fetched Data:', response.data);
            return response.data;
          })
          .then((data) => {
            console.log('Fetched Data:', data.data);
            settransaction(data.data);
          })
          .catch((error) => console.error(`Error fetching ${getCookie('userID')} data:`, error));
    }

    useState(() => {
        if (getCookie("userID")) {
          submitloginForm();
        }
      }, []);

    return (
      <div>
        <h2>My Orders</h2>
        <p>Here are your orders...</p>
        <div>Your Transactions:</div>
        <ul>
          {transaction && transaction.length > 0 ? (
            transaction.map((transaction) => (
              <li key={transaction.transactionID}>
                <div>Transaction ID: {transaction.TransactionID}</div>
                <div>Shipper ID: {transaction.ShipperID}</div>
                <div>Shipper Name: {transaction.ShipperName}</div>
              </li>
            ))
          ) : (
            <li>No transactions available</li>
          )}
        </ul>
      </div>
    );
  };
  
  export default MyOrders;
  