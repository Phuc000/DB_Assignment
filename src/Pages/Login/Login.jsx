  import { useEffect, useState } from "react";
  import { Header, Footer } from "../../Components";
  import "./Login.css";
  import axios, { AxiosError } from "axios";
  const Login = () => {
    // Variables for customer information

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
  

    const signup = async () => {
      setformData({
        ...formData,
        CFName: CFName,
        CLName: CLName,
        CAddress: CAddress,
        CPhone: CPhone,
      });
      const status = await axios.get(`http://localhost:8080/customers/lastid`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log('Fetched Data:', response.data)
        return response.data
      })
      .then((data) => {
        console.log('Fetched Data:', data)
        const newID = data + 1
        console.log(newID)
        setformData({
          ...formData,
          CustomerID: newID,
          CFName: CFName,
          CLName: CLName,
          CAddress: CAddress,
          CPhone: CPhone,
          // CustomerID: newID,
          // CFName: CFName,
          // CLName: CLName,
          // CAddress: CAddress,
          // CPhone: CPhone
        });   
      })    
      
      console.log('Form Data:', formData); // Add this line
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
    const response = await axios.get(`http://localhost:8080/customers/customer-rank/${getCookie('userID')}`,{
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
      setShowuserLogin(true);
      setShowSignup(false);
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
        const status = await axios.get(`http://localhost:8080/customers/login/${CPhone}/${CFName}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('Fetched Data:', response.data)
          return response.data
        })
        .then((data) => {
          console.log('Fetched Data:', data)
          setCookie( 'userID', data.CustomerID , 1);       
          setShowuserLogin(false);
          setShowSignup(false);
          setShowuser(true);
          setcookie(getCookie('userID'))
          console.log(getCookie('userID'))
        })  
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
            setCLName(data.LastName);
            setCAddress(data.Address);
          })
          .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
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
          const status = await axios.get(`http://localhost:8080/employees/info/${CFName}/${CPhone}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('Fetched Data:', response.data)
          return response.data
        })
        .then((data) => {
          console.log('Fetched Data:', data)
          setCookie('managerID', data.EmployeeID , 1 )
          setShowuserLogin(false);
          setShowSignup(false);
          setShowmanager(true);
          setcookie(getCookie('managerID'))
        })
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
            setCLName(data.LastName);
            setCAddress(data.CAddress);
          })
          .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
      };
    

    const restock = async () => {
      axios.put(`http://localhost:8080/products/addtostore/${productID}/${storeID}/${amount}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log('Restock success', response)
        /*setproductID('');
        setstoreID('');
        setamount('');*/
      })
    }

    const getRankIcon = () => {
      switch (rank) {
        case 'iron':
          return < img src= "Images/bronze.png" alt="Iron Icon"/>;
        case 'bronze':
          return < img src= "Images/plat.png" alt="Bronze Icon"/>;
        case 'silver':
          return < img src= "Images/plat.png" alt="Silver Icon"/>;
        case 'gold':
          return < img src= "Images/plat.png" alt="Gold Icon"/>;
          case 'platinum':
            return < img src= "Images/plat.png" alt="Platinum Icon"/>;
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

    return (
      <div className="login">
        <Header />
            {/*Choose privilegde */}
            {showprivilgde && (
              <form id="choosing priviledge">
              <section className="form">
                <p>Login as:</p>
              <button className="form-button" type="button" onClick={toggleManagerlogin} >
              Manager
              </button>
              <button className="form-button" type="button" onClick={toggleUserlogin } >
              Customer
              </button>
              </section>
              </form>
            )}
            
            {showmanagerLogin && (
              <div className="managerform">
                <form id="managerFormPopup" onSubmit={submitmanagerLoginForm}>
                  {/* Manager login form inputs */}
                <label className="form-label" >
                Full Name:
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="CFName"
                  name="CFName"
                  required
                  value={CFName}
                  onChange={(e) => setCFName(e.target.value)}
                />
                <label className="form-label" >
                  Tel:
                </label>
                <input
                  className="form-input"
                  type="password"
                  id="Tel"
                  name="CPhone"
                  required
                  value={CPhone}
                  //test using input of Tel for cookie valu
                  onChange={(e) => setCPhone(e.target.value)}
                />
                <button className="form-button" type="button" onClick={submitmanagerLoginForm} >
                  Log in
                </button>
                </form>
              </div>
            )}

        <div className="login-content" >
          <section className="form">
            {/*This is where user login start*/ }
            {showuserLogin && (
              <form id="loginForm" onSubmit={submitloginForm}>
                {/* Existing login form inputs here */}
                <label className="form-label" >
                Full Name:
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="CFName"
                  name="CFName"
                  required
                  value={CFName}
                  onChange={(e) => setCFName(e.target.value)}
                />
                <label className="form-label" >
                  Tel:
                </label>
                <input
                  className="form-input"
                  type="password"
                  id="Tel"
                  name="Tel"
                  required
                  value={CPhone}
                  //test using input of Tel for cookie valu
                  onChange={(e) => setCPhone(e.target.value)}
                />
                {/* ... */}
                <button className="form-button" type="button" onClick={submitloginForm} >
                  Log in
                </button>
                <label className="form-sigup-label" >
                  Dont have an account?
                </label>
                <button className="form-signup-button" type="button" onClick={toggleSignup} >
                  Sign up
                </button>
              </form>
            )}

            {/* Signup form pop-up */}
            {showSignup && (
              <div className="signup-popup">
                <form id="signupFormPopup" onSubmit={submitsignupForm}>
                  {/* Signup form inputs */}
                <label className="form-label" >
                Full Name:
                </label>
                <input className="form-input" type="text" id="CFName" name="CFName" required value={CFName} onChange={(e) => setCFName(e.target.value)}  />
                <label className="form-label" >
                  Last Name:
                </label>
                <input className="form-input" type="text" id="CLName" name="CLName" required value={CLName} onChange={(e) => setCLName(e.target.value)} />
                <label className="form-label" >
                  Address:
                </label>
                <input className="form-input" type="text" id="CAddress" name="CAddress" required value={CAddress} onChange={(e) => setCAddress(e.target.value)} />
                <label className="form-label" >
                  Phone:
                </label>
                <input className="form-input" type="password" id="Phone" name="Phone" required value={CPhone} onChange={(e) => setCPhone(e.target.value)} />
                
                  {/* ... */}
                  <button className="form-button" type="button" onClick={signup}>
                    Sign up
                  </button>
                  <button className="form-login-button" type="button" onClick={toggleSignup} >
                  Back to log in
                </button>
                </form>
              </div>
            )}
          </section>
          {showuser &&(
            <form className="customer_form">
            <div>Hello user {CFName} {CLName}</div>
            <div>Your number {CPhone}</div>
            {rank !== null ? (
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
            </form>
          )}
          {showmanager&&(
            <form >
            <div>Hello manager {CFName}</div>
            <label className="form-label" >
              ProductID:
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={productID} required onChange={(e) => setproductID(e.target.value)} />
            <label className="form-label" >
              StoreID
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={storeID} required onChange={(e) => setstoreID(e.target.value)} />
            <label className="form-label" >
              Ammount:
            </label>
            <input className="form-input" type="text" id="productID" name="ProductID" value={amount} required onChange={(e) => setamount(e.target.value)} />
            <button className="form-button" onClick={restock}>
              Restock
            </button>
            </form>
          )}


        </div>
        <Footer />
      </div>
    );
  };

  export default Login;
  