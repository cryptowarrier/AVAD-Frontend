import React from 'react';

function Footer() {

    return (
        <footer className="footer-section bg_img" data-background="assets/images/footer/footer-bg.jpg">
            <div className="container">
                <div className="footer-top padding-top padding-bottom">
                    <div className="logo">
                        <a href="#0">
                            <img src="assets/images/logo/footer-logo.png" alt="logo"/>
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <ul className="footer-link">
                        <li>
                            <a href="#0">Join us on Telegram</a>
                        </li>
                        <li>
                            <a href="#0">Join us on Twitter</a>
                        </li>
                    </ul>
                </div>
                <div className="copyright">
                    <p>
                        Copyright © 2022.All Rights Reserved By <a href="#0">AVAD</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;