import { useState } from "react";
import { Header, Footer } from "../../Components";
import "./Login.css";

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

  /*  make cookie when need to get customer id
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };

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
  */

  const submitsignupForm = async () => {
        // Perform database update with the new customer information
        try {
          const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ FName, phone }),
          });
          if (response.ok)
          await updateDatabase(FName,LName,address,phone/* other customer details */);
        } catch (error) {
          console.error(error);
        }
  };

  const submitloginForm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FName, phone }),
      });
      response.ok=true;
      if (response.ok) {
        setShowuserLogin(false);
        setShowSignup(false);
        setFName("Customer fname");// Get customer from database
        setLName("Customer lname");
        setphone("Customer phone");
        setAddress("Customer address");
        }
       else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitmanagerLoginForm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FName, phone }),
      });
      response.ok=true;
      if (response.ok) {
        setShowuserLogin(false);
        setShowSignup(false);
        setFName("Manager fname");// Get Manager from database
        setLName("Manager lname");
        setphone("Manager phone");
        setAddress("Manager address");
        }
       else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
    }
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
              <form id="managerFormPopup" onSubmit={submitmanagerLoginForm}>
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
              <button className="form-button" type="button" onClick={submitloginForm} >
                Log in
              </button>
              <label className="form-sigup-label" >
                Don't have an account?
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
              <input className="form-input" type="text" id="FName" name="FName" required value={FName} onChange={(e) => setFName(e.target.value)}  />
              <label className="form-label" >
                Last Name:
              </label>
              <input className="form-input" type="text" id="LName" name="LName" required value={LName} onChange={(e) => setLName(e.target.value)} />
              <label className="form-label" >
                Address:
              </label>
              <input className="form-input" type="text" id="address" name="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
              <label className="form-label" >
                Phone:
              </label>
              <input className="form-input" type="password" id="Phone" name="Phone" required value={phone} onChange={(e) => setphone(e.target.value)} />
              
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
        {!showSignup && !showmanagerLogin && !showuserLogin && (
          <form >
            <div className="form-label">Greetings {FName}</div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
