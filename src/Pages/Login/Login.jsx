import { useEffect, useState } from "react";
import { Header, Footer } from "../../Components";
import "./Login.css";
import axios from "axios";
const Login = () => {
  // Variables for customer information

  const [FName, setFName] = useState("");
  const [LName, setLName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setphone] = useState("");

  
  // Variable to swap between sign up and sign in
  const [showSignup, setShowSignup] = useState(false);
  const [showuserLogin, setShowuserLogin] = useState(false);
  const [showmanagerLogin, setShowmanagerLogin] = useState(false);
  const [showprivilgde, setShowprivilgde] = useState(true);
  const [showmanager, setShowmanager] = useState(false);
  const [showuser, setShowuser] = useState(false);

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setformData]= useState({
    FName:'',
    LName:'',
    address:'',
    phone:'',
  })
  /* make cookie when need to get customer id*/
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };
  /*Take cookie
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
  }*/
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
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
  };

    const submitloginForm = async () => {
      axios.get(`http://localhost:8080/customers/${phone}/${FName}`, {
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
        setCookie('userID', data,1)
        setShowuserLogin(false);
        setShowSignup(false);
        setShowuser(true);
      })
      
    };

  const submitmanagerLoginForm = async () => {
      axios.get(`http://localhost:8080/manager/${phone}/${FName}`, {
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
        setCookie('managerID', data,1)
        setShowuserLogin(false);
        setShowSignup(false);
        setShowmanager(true);
      })
  };
  const toggleSignup = () => {
    setShowSignup(!showSignup);
    setShowuserLogin(!showuserLogin);
    setFName("");
    setLName("");
    setphone("");
    setAddress("")
  };
  const toggleUserlogin =() =>{
    setShowuserLogin(!showuserLogin);
    setShowprivilgde(!showprivilgde)
    setFName("");
    setphone("");
  }
  const togglemanager =() =>{
    setShowmanagerLogin(!showmanagerLogin)
    setShowmanager(!showmanager)
  }
  const toggleuser =() =>{
    setShowuser(!showuser)
    setShowuserLogin(!showuserLogin)
  }
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
              <form id="managerFormPopup" onSubmit={togglemanager}>
                {/* Manager login form inputs */}
              <label className="form-label" >
              First Name:
              </label>
              <input
                className="form-input"
                type="text"
                id="FName"
                name="FName"
                required
                value={FName}
                onChange={(e) => setFName(e.target.value)}
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
                value={phone}
                //test using input of Tel for cookie valu
                onChange={(e) => setphone(e.target.value)}
              />
              <button className="form-button" type="button" onClick={togglemanager} >
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
              First Name:
              </label>
              <input
                className="form-input"
                type="text"
                id="FName"
                name="FName"
                required
                value={FName}
                onChange={(e) => setFName(e.target.value)}
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
                value={phone}
                //test using input of Tel for cookie valu
                onChange={(e) => setphone(e.target.value)}
              />
              {/* ... */}
              <button className="form-button" type="button" onClick={toggleuser} >
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
              First Name:
              </label>
              <input className="form-input" type="text" id="FName" name="FName" required value={formData.FName} onChange={handleInputChange}  />
              <label className="form-label" >
                Last Name:
              </label>
              <input className="form-input" type="text" id="LName" name="LName" required value={formData.LName} onChange={handleInputChange} />
              <label className="form-label" >
                Address:
              </label>
              <input className="form-input" type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange} />
              <label className="form-label" >
                Phone:
              </label>
              <input className="form-input" type="password" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} />
              
                {/* ... */}
                <button className="form-button" type="submit">
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
          <form>
          <div>Hello user {FName}</div>
          <div>I know your tel {phone}</div>
          </form>
        )}
        {showmanager&&(
          <form >
          <div>Hello manager {FName}</div>
          <div>To do</div>
          </form>
        )}


      </div>
      <Footer />
    </div>
  );
};

export default Login;
