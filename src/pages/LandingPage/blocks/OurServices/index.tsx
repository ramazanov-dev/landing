import Icon from "~components/Icon";
import bgImg from "./assets/images/bg.png";
import styles from "./index.module.css";

export default function OurServices() {
  /* DOM */
  return (
    <div id="our-services" className={styles.OurServices}>
      <div className={styles.container}>
        {/* Info container */}
        <div className={styles.infoContainer}>
          <div className={styles.infoContainerImgContainer}>
            <img className={styles.infoContainerImg} src={bgImg} alt="" />
          </div>

          <div>
            <h1>Our Services</h1>

            <div style={{height: 50}} />

            <div className={styles.servicesList}>
              <div className={styles.servicesListItem}>
                <div className={styles.servicesListItemIcon}>
                  <Icon icon="custom-arrow-2" />
                </div>

                <div className={styles.servicesListItemContents}>
                  Crypto exchange:
                </div>
                <p>
                  Securely handle your cryptocurrency transactions with us.
                </p>
              </div>

              <div className={styles.servicesListItem}>
                <div className={styles.servicesListItemIcon}>
                  <Icon icon="custom-arrow-2" />
                </div>

                <div className={styles.servicesListItemContents}>
                  20+ Tokens:
                </div>
                <p>
                  Easily convert between various digital assets with our extensive token options. </p>
              </div>

              <div className={styles.servicesListItem}>
                <div className={styles.servicesListItemIcon}>
                  <Icon icon="custom-arrow-2" />
                </div>

                <div className={styles.servicesListItemContents}>
                  Secure wallets:
                </div>
                <p>
                  Safely store your cryptocurrencies with advanced security features.
                </p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
