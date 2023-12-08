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
                  <img src="/Images/logo.png" alt="logo-shophouse" class="nav__logo" />
                </Link>
              <div class="header-with-search__search-section">
                <div class="search_body">
                    <div class="search-container">
                      <input type="text" class="search-input" id="searchInput" placeholder="Search..."/>
                      <button class="search-button">Search</button>
                    </div>
                  </div>
              </div>
            <ul class="nav__navigation">
                <Link to="/" className={getNavItemClass("/")}>
                  <p class="a__navbar btn btn--primary">HOME</p>
                </Link>
                <a href="#" class="a__navbar btn btn--primary"><li class="nav__item">CONTACT US</li></a>
                <a href="#" class="a__navbar btn btn--primary"><li class="nav__item">OFFERTS</li></a>
                <Link to="/Cart" className={getNavItemClass("/Cart")}>
                  <p class="a__navbar btn btn--primary">MY CART</p>
                </Link>
                <Link to="/Login" className={getNavItemClass("/Login")}>
                  <p class="a__navbar btn btn--primary">LOGIN</p>
                </Link>
            </ul>
            <i class="fas fa-bars wrap-menu" aria-label="Abrir menú"></i>
          </nav>
        </div>
    )
}

export default Header;