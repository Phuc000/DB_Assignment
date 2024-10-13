import { Link, useLocation, useNavigate } from "react-router-dom";
import Title from '../Common/Title/Title';
import "./UserMenu.scss";


const UserMenu = ({ username, onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  function deleteCookie(cookieName) {
    if (getCookie(cookieName)) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  function logout(user) {
    deleteCookie(user);
    // go to home page
    navigate("/");
  }

  return (
    <div className="menu-item-wrapper">

      <Title titleText={`Hello, ${username}!`} />
      <p className="text-base font-light italic">Welcome to your account.</p>

      
      <div class="usr-menu-list">
        <ul>
          <li><span onClick={() => onMenuClick("MyOrders")}>My Orders</span></li>
          <li><span onClick={() => onMenuClick("Promotions")}>Promotions</span></li>
          <li><span onClick={() => onMenuClick("MyAccount")}>My Account</span></li>
          <li><span onClick={() => logout('userID')}>Logout</span></li>

        </ul>
      </div>
    </div>
  );
};

export default UserMenu;