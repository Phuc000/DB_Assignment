import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Login, Cart, Category, BuyProduct, Store, Profile, AboutUs, CheckOut } from "./Pages";
import { CartProvider } from './Context/CartContext';
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Category/:categoryName" element={<Category />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/CheckOut" element={<CheckOut />} />
              <Route path="/buy-product/:productId/:storeId" element={<BuyProduct />} />
              <Route path="/store/:storeId" element={<Store />} />
              <Route path="/AboutUs" element={<AboutUs />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
