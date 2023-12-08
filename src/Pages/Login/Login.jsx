import { useState } from "react";
import { Header, Footer } from "../../Components";
import "./Login.css";

const Login = () => {
  // Variables for customer information
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [address, setAddress] = useState("");

  
  // Variable to swap between sign up and sign in
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  // Variable to check if the account is logged in successful yet
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInAccount, setLoggedInAccount] = useState("");

  //Create a cookie for userID
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };

  //Get the userID
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
  
    const userID = getCookie("userID");
    //Show value in console log
    if (userID) {
      console.log("Value of myCookie:", userID);
    } else {
      console.log("myCookie not found");
    }
  
  const submitForm = async () => {
    try {
      const endpoint = showLogin ? "loginEndpoint" : "signupEndpoint";

      const response = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (showLogin) {
          setIsLoggedIn(true);
          setLoggedInAccount(responseData.account); // Assuming your API returns the account name
        } else {
          // Additional logic for signup success
        }
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup);
    setShowLogin(false);
    setAccount("");
    setPassword("");
    setfullName("");
    setAddress("")
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowSignup(false);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setCookie("userID", newPassword, 1);
  };
  return (
    <div className="login">
      <Header />
      <div className="login-content">
        <section className="form">
          {showLogin && (
            <form id="loginForm">
              {/* Existing login form inputs here */}
              <label className="form-label" >
              Account:
              </label>
              <input
                className="form-input"
                type="text"
                id="Account"
                name="Account"
                required
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
              <label className="form-label" >
                Password:
              </label>
              <input
                className="form-input"
                type="password"
                id="Password"
                name="Password"
                required
                value={password}
                //test using input of password for cookie valu
                onchange={handlePasswordchage}
                //onChange={(e) => setPassword(e.target.value)}
              />
              {/* ... */}
              <button className="form-button" type="button" onClick={submitForm} >
                Sign in
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
              <form id="signupFormPopup" onSubmit={submitForm}>
                {/* Signup form inputs */}
                <label className="form-label" >
              Full Name:
              </label>
              <input className="form-input" type="text" id="fullName" name="fullName" required value={fullName} onChange={(e) => setfullName(e,target,value)}  />
              <label className="form-label" >
                Address:
              </label>
              <input className="form-input" type="text" id="address" name="address" required value={address} onChange={(e) => setAddress(e,target,value)} />
              
              <label className="form-label" >
                Account:
              </label>
              <input className="form-input" type="text" id="Account" name="Account" required value={account} onChange={(e) => setAccount(e,target,value)} />
              <label className="form-label" >
                Password:
              </label>
              <input className="form-input" type="text" id="Password" name="Password" required value={password} onChange={(e) => setPassword(e,target,value)} />
              
                {/* ... */}
                <button className="form-button" type="submit">
                  Sign up
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
