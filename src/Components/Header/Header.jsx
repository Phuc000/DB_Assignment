import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const location = useLocation();

    const getNavItemClass = (pathname) => {
      return location.pathname === pathname ? "navbar-item current-page" : "navbar-item";
    };

    const search = () => {
        const a = true
    }
    return (
        <div className="header">
            <nav>
                <Link to="/" className={getNavItemClass("/")}>
                  <img src="/Images/logo.png" alt="logo-shophouse" className="nav__logo" />
                </Link>
              <div className="header-with-search__search-section">
                <div className="search_body">
                    <div className="search-container">
                      <input type="text" className="search-input" id="searchInput" placeholder="Search..."/>
                      <button className="search-button">Search</button>
                    </div>
                  </div>
              </div>
            <ul className="nav__navigation">
                <Link to="/" className={getNavItemClass("/")}>
                  <p className="a__navbar btn btn--primary">HOME</p>
                </Link>
                <a href="#" className="a__navbar btn btn--primary"><li className="nav__item">CONTACT US</li></a>
                <a href="#" className="a__navbar btn btn--primary"><li className="nav__item">OFFERS</li></a>
                <Link to="/Cart" className={getNavItemClass("/Cart")}>
                  <p className="a__navbar btn btn--primary">MY CART</p>
                </Link>
                <Link to="/Login" className={getNavItemClass("/Login")}>
                  <p className="a__navbar btn btn--primary">LOGIN</p>
                </Link>
            </ul>
            <i className="fas fa-bars wrap-menu" aria-label="Abrir menú"></i>
          </nav>
        </div>
    )
}

export default Header;