import "./Footer.css";

const Footer = () => {

    return (
        <div className="footer">
            <div class="footer__container container">
                <div class="footer__info-social">
                    <div class="footer__info">
                        <img src="/Images/logo_white.svg" alt="Shop house logo" class="footer__logo" />
                        <ul class="footer__list info__list">
                            <li class="footer__item info__item">123 Nguyen Van Cu</li>
                            <li class="footer__item info__item">+84 999-999-999</li>
                            <li class="footer__item info__item">AEON@aeon.com</li>
                        </ul>
                    </div>

                    <div class="footer__social">
                        <h3 class="footer-subtitle">OUR SOCIAL MEDIA</h3>
                        <ul class="footer__list social__list">
                            <a href="#" class="social__link">
                                <li class="footer__item social__item"><i class="fab fa-facebook"></i></li></a>
                            <a href="#" class="social__link">
                                <li class="footer__item social__item"><i class="fab fa-instagram"></i></li> </a>
                            <a href="#" class="social__link">
                                <li class="footer__item social__item"><i class="fab fa-twitter-square"></i></li>
                            </a>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;