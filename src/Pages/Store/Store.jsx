import { useParams, Link } from 'react-router-dom';
import {Header, Footer} from "../../Components";
import "./Store.css";

const Store = () => {
    const { storeId } = useParams();
  return (
    <div className="store">
      <Header/>
      <div className="store-content">
      <h1>{storeId} Store</h1>
    </div>
    <Footer/>
    </div>
  );
};

export default Store;