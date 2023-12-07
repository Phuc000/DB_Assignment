import {Header, Footer} from "../../Components";
import "./Cart.css";

const Cart = () => {
  return (
    <div className="cart">
      <Header/>
      <div className="cart-content">
      <h1>My cart</h1>
    </div>
    <Footer/>
    </div>
  );
};

export default Cart;