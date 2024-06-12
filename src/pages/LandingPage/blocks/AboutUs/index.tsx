import Icon from "~components/Icon";
import styles from "./index.module.css";

import bgMobileImg from "./assets/images/bg-mobile.svg";
import bgImg from "./assets/images/bg.svg";

export default function AboutUsBlock() {
  /* DOM */
  return (
    <div id="about-us" className={styles.AboutUsBlock}>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1>About us</h1>

          <div style={{height: 30}} />

          <p>
            One Satoshi Global is a licensed cryptocurrency exchange company operating under the regulatory directive of
            the Free Industrial Zone in Georgia (license number 0110/533). Headquartered in Georgia, we are a global
            financial institution led by a team of experts in cryptocurrency, asset management, fintech, regulatory
            compliance, financial services, and payments. Committed to customer satisfaction, we employ advanced and
            legally compliant technologies to deliver tailored services and solutions.
          </p>

          <div style={{height: 50}} />

          <button className="isDuctile isDarkBlue">
            <span>Start now</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>

        <img src={bgImg} className={styles.desktopBackground} alt="" />
        <img src={bgMobileImg} className={styles.mobileBackground} alt="" />
      </div>
    </div>
  );
}
