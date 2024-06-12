import classNames from "classnames";
import React, {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Icon from "~components/Icon";
import GetInTouchBlock from "~pages/LandingPage/blocks/GetInTouch";
import bgImg from "../signInPage/assets/images/background.png";
import AboutUsBlock from "./blocks/AboutUs";
import FastExchangeBlock from "./blocks/FastExchange";
import OurServices from "./blocks/OurServices";
import WelcomeBlock from "./blocks/Welcome";
import WhyBlock from "./blocks/Why";
import styles from "./index.module.css";

export default function LandingPage() {
  /* Hooks */
  const $navigate = useNavigate();
  const $location = useLocation();

  /* State */
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);

  /* Close mobile aside after location change */
  useEffect(() => {
    setIsMobileNavActive(false);
  }, [$location]);

  /* DOM */
  return (
    <div className={styles.LandingPage}>
      {/* Header */}
      <header className={styles.header}>
        <img src="/logo.svg" alt="logo" />

        <nav className={classNames({isHidden: !isMobileNavActive})}>
          <a href="#welcome">Home page</a>
          <a href="#why-rd">Why OSG</a>
          <a href="#about-us">About us</a>
          <a href="#our-services">Our services</a>
          <a href="#contact-us">Contact us</a>
        </nav>

        <button
          className={classNames(
            "isDuctile",
            styles.headerSignInButton
          )}
          onClick={() => $navigate("/login?act=welcome")}
        >
          <span>
            Start now
          </span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>

        <button
          className={classNames("isZeroed", styles.headerNavSwitchButton)}
          onClick={() => setIsMobileNavActive(!isMobileNavActive)}
        >
          <Icon icon="custom-menu-1" />
        </button>
      </header>

      {/* Blocks */}
      <WelcomeBlock />
      <FastExchangeBlock />
      <WhyBlock />
      <AboutUsBlock />
      <GetInTouchBlock />
      <OurServices />

      {/* Contact us ancor */}
      <div id="contact-us" />

      {/* Footer desktop */}
      <footer className={classNames(styles.footer)}>
        <div className={styles.footerContainer}>
          <div className={styles.footerFlexContainer}>
            <img className={styles.footerLogo} src="/logo.svg" alt="logo" />
            <button className="isWhite isDuctile">
              <span>Start now</span>
              <Icon icon="custom-arrow-top-right-1" />
            </button>
          </div>
          <div className={classNames(styles.footerFlexContainer, styles.footerBottomContent)}>
            <div className={styles.footerCopyright}>
              ©2024 One Satoshi Global. All Rights Reserved.
            </div>

            <a href="mailto:info@onesatoshiglobal.hk" className={styles.footerMail}>info@onesatoshiglobal.hk</a>
          </div>
        </div>
      </footer>


    </div>
  );
}
