import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../Components";
import "./Profile.css";
import axios, { AxiosError } from "axios";
const Profile = () => {
  // Variables for customer information

  const navigate = useNavigate();

  const [CFName, setCFName] = useState("");
  const [CLName, setCLName] = useState("");
  const [CAddress, setCAddress] = useState("");
  const [CPhone, setCPhone] = useState("");
  const [rank, setrank] = useState("");
  const [transaction, settransaction] = useState([]);
  const [promotion, setpromotion] = useState([]);
  //Varables for product restock
  const [productID, setproductID] = useState("");
  const [storeID, setstoreID] = useState("");
  const [amount, setamount] = useState("");

  // Variable to swap between sign up and sign in
  const [showSignup, setShowSignup] = useState(false);
  const [showuserLogin, setShowuserLogin] = useState(false);
  const [showmanagerLogin, setShowmanagerLogin] = useState(false);
  const [showprivilgde, setShowprivilgde] = useState(true);
  const [showmanager, setShowmanager] = useState(false);
  const [showuser, setShowuser] = useState(false);

  //Cookie
  const [cookie, setcookie] = useState(false);

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setformData]= useState({
    CFName:'',
    CLName:'',
    CAddress:'',
    CPhone:'',
    CustomerID: 0,
  })
  /* make cookie when need to get customer id*/
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };
  /*Take cookie*/
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

//   delete cookie 
    function deleteCookie(cookieName) {
        if (getCookie(cookieName)) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    }

  useEffect(() => {
    // This effect will be triggered whenever formData is updated
    setformData({
      ...formData,
      CFName: CFName,
      CLName: CLName,
      CAddress: CAddress,
      CPhone: CPhone,
    });

    if (CFName === "" || CLName === "" || CAddress === "" || CPhone === "") {
      return;
    }
  
    if(formData.CustomerID === 0) {
    axios.get(`http://localhost:8080/customers/lastid`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log('Fetched Data:', data)
        const newID = data + 1;
        setformData({
          ...formData,
          CustomerID: newID,
          CFName: CFName,
          CLName: CLName,
          CAddress: CAddress,
          CPhone: CPhone,
        });
      })
      .then(() => {
        // Use useEffect to ensure state update is complete before calling submitsignupForm
      })
      .catch((error) => console.error("Error fetching data:", error));
    }
  }, [CFName, CLName, CAddress, CPhone]);


  const signup = () => {

    console.log('Form Data:', formData);

    axios.get(`http://localhost:8080/customers/lastid`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log('Fetched Data:', data)
        const newID = data + 1;
        setformData({
          ...formData,
          CustomerID: newID,
          CFName: CFName,
          CLName: CLName,
          CAddress: CAddress,
          CPhone: CPhone,
        });
      })
      .then(() => {
        console.log('Form Data:', formData);
        // Use useEffect to ensure state update is complete before calling submitsignupForm
        submitsignupForm();
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  
  const submitsignupForm = async () => {
    try {
      // Making a POST request using axios
      const response = await axios.post('http://localhost:8080/customers/', formData);

      // Updating the state with the response data
      setResponse(response.data);
      setError(null);
  } catch (error) {
      // Handling errors
      setResponse(null);
      setError('Error posting data');
      console.error('Error posting data:', error);
  }
    setShowuserLogin(true);
    setShowSignup(false);
  };

    const submitloginForm = async () => {

      axios.get(`http://localhost:8080/customers/${getCookie('userID')}`, {
      headers: {
          "Content-Type": "application/json",
      },
      })
        .then((response) => {
          console.log('Fetched Cookie:', response.data);
          return response.data;
        })
        .then((data) => {
            console.log('Fetched Cookie:', data);
            setCFName(data.CFName);
            setCLName(data.CLName);
            setCAddress(data.CAddress);
            setCPhone(data.CPhone);
        })
        .catch((error) => console.error(`Error fetching ${cookie} data:`, error));

    axios.get(`http://localhost:8080/customers/customer-rank/${getCookie('userID')}`,{
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log('Fetched Data:', response.data)
      return response.data
    })
    .then((data) => {
      console.log('Fetched Data:', data.rank);
      setrank(data.rank);
    })

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
          .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
      }

      
  const submitmanagerLoginForm = async () => {
      axios.get(`http://localhost:8080/employees/${getCookie('managerID')}`, {
      headers: {
        "Content-Type": "application/json",
      },
      })
        .then((response) => {
          console.log('Fetched cookie:', response.data);
          return response.data;
        })
        .then((data) => {
          console.log('Fetched cookie:', data);
          setCFName(data.FirstName);
          setCLName(data["LastName "]);
          setCAddress(data["Address "]);
        })
        .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
    };
  

  const restock = async (event) => {
    event.preventDefault();
    console.log('Restock:', productID, storeID, amount);
    axios.put(`http://localhost:8080/products/addtostore/${productID}/${storeID}/${amount}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log('Restock success', response);
      return response.data;
      /*setproductID('');
      setstoreID('');
      setamount('');*/
    })
    .catch((error) => console.error(`Error restocking ${productID} data:`, error));
  }

  const getRankIcon = () => {
    switch (rank) {
      case 'iron':
        return < img src= "Images/bronze.png" alt="Iron Icon" style={{ width: "75px", height: "auto" }}/>;
      case 'bronze':
        return < img src= "Images/iron.png" alt="Bronze Icon" style={{ width: "75px", height: "auto" }}/>;
      case 'silver':
        return < img src= "Images/silver.png" alt="Silver Icon" style={{ width: "75px", height: "auto" }}/>;
      case 'gold':
        return < img src= "Images/gold.png" alt="Gold Icon" style={{ width: "75px", height: "auto" }}/>;
        case 'platinum':
          return < img src= "Images/plat.png" alt="Platinum Icon" style={{ width: "75px", height: "auto" }}/>;
      default:
        return null; // You can customize this based on your actual rank values
    }
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
    setShowuserLogin(!showuserLogin);
    setCFName("");
    setCLName("");
    setCPhone("");
    setCAddress("")
    setformData({
      ...formData,
      CustomerID: 0,
    });
  };
  const toggleUserlogin =() =>{
    setShowuserLogin(!showuserLogin);
    setShowprivilgde(!showprivilgde)
    setCFName("");
    setCPhone("");
  }
  /*const togglemanager =() =>{
    setShowmanagerLogin(!showmanagerLogin)
    setShowmanager(!showmanager)
  }
  const toggleuser =() =>{
    setShowuser(!showuser)
    setShowuserLogin(!showuserLogin)
  }*/
  const toggleManagerlogin =() =>{
    setShowmanagerLogin(!showmanagerLogin);
    setShowprivilgde(!showprivilgde)
  }

    function logout(user) {
        deleteCookie(user);
        // go to home page
        navigate("/");
    }


  useState(() => {
    if (getCookie("userID")) {
      submitloginForm();
      setShowuser(true);
    }
    else if (getCookie("managerID")) {
      submitmanagerLoginForm();
      setShowmanager(true);
    }
  }, []);

  return (
    <div className="login">
      <Header />
          

      <div className="login-content" >
        {showuser &&(
          <form className="customer_form">
          <div>Hello user {CFName} {CLName}</div>
          <div>Your number {CPhone}</div>
          {rank !== "" ? (
            <div>
              Your current rank: {rank} {getRankIcon()}
            </div>
          ) : (
            <p>No rank available</p>
          )}
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
            <button className="form-button" onClick={() => logout('userID')}>
                Logout
            </button>
          </form>
        )}
        {showmanager&&(
          <form >
          <div>Hello manager {CFName} {CLName}! </div>
          <label className="form-label" >
            ProductID:
          </label>
          <input className="form-input" type="text" id="productID" name="ProductID" value={productID} required onChange={(e) => setproductID(e.target.value)} />
          <label className="form-label" >
            StoreID:
          </label>
          <input className="form-input" type="text" id="productID" name="ProductID" value={storeID} required onChange={(e) => setstoreID(e.target.value)} />
          <label className="form-label" >
            Amount:
          </label>
          <input className="form-input" type="text" id="productID" name="ProductID" value={amount} required onChange={(e) => setamount(e.target.value)} />
          <button className="form-button" onClick={restock}>
            Restock
          </button>
            <button className="form-button" onClick={() => logout('managerID')}>
                Logout
            </button>
          </form>
        )}
        {!showuser && !showmanager &&(
            <div>
              <h2> Please login to view your profile</h2>
            </div>
        )}


      </div>
      <Footer />
    </div>
  );
};

export default Profile;
