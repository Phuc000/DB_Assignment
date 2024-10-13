import React from "react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


function SignInForm() {
    const navigate = useNavigate();
    const [state, setState] = useState({
      CUsername: "",
      CPhone: ""
    });

    const [cookie, setcookie] = useState(false);


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

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { email, password } = state;
    alert(`You are login with email: ${email} and password: ${password}`);

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  const submitloginForm = async (evt) => {
    // prevent default action
    evt.preventDefault();

    const { CUsername, CPhone } = state;
    console.log(CUsername, CPhone)
    const status = await axios.get(`http://localhost:8080/customers/login/${CPhone}/${CUsername}`, {
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
      setcookie(getCookie('userID'));
      console.log(getCookie('userID'));
        // navigate to the home page
        navigate("/");
    }) 
    .catch((error) => console.error("Error fetching data:", error));
    setState({
        CUsername: "",
        CPhone: ""
        });
    }

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={submitloginForm}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fa fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fa fa-google" />
          </a>
          <a href="#" className="social">
            <i className="fa fa-envelope-o" />
          </a>
        </div>
        <span>or use your account</span>
        <input
          type="text"
          placeholder="Username"
          name="CUsername"
          value={state.CUsername}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="CPhone"
          placeholder="Password"
          value={state.CPhone}
          onChange={handleChange}
            required
        />
        <a className="link-L1" href="#">Forgot your password?</a>
        <button className="button-77">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
