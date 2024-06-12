import classNames from "classnames";
import landingStyles from "../../index.module.css";
import styles from "./index.module.css";


export default function WhyBlock() {
  /* DOM */
  return (
    <div id="why-rd" className={styles.WhyBlock}>
      <div className={styles.container}>
        {/* Info container */}
        <div className={styles.infoContainer}>
          <div>
            <h1>Why One Satoshi Global?</h1>

            <div className={landingStyles.infoBlocksContainer}>
              <div className={landingStyles.infoBlock}>
                <div className={landingStyles.infoBlockTitle}>
                  Easy fiat access:
                </div>

                <div className={landingStyles.infoBlockNumber}>1</div>

                <div className={landingStyles.infoBlockContents}>
                  Quickly deposit and withdraw
                  various currencies using multiple
                  methods like wire transfers and
                  electronic wallets.
                </div>
              </div>

              <div className={landingStyles.infoBlock}>
                <div className={landingStyles.infoBlockTitle}>
                  Flexible transaction
                  options:
                </div>

                <div className={landingStyles.infoBlockNumber}>2</div>

                <div className={landingStyles.infoBlockContents}>
                  Choose from multiple payment
                  channels for seamless deposits
                  and withdrawals tailored to your
                  needs.
                </div>
              </div>

              <div className={landingStyles.infoBlock}>
                <div className={landingStyles.infoBlockTitle}>
                  High-level asset
                  protection:
                </div>

                <div className={landingStyles.infoBlockNumber}>3</div>

                <div className={landingStyles.infoBlockContents}>
                  Your crypto funds are safeguarded
                  with top industry standards, including
                  advanced security features like
                  biometric identification.
                </div>
              </div>

              <div className={classNames(landingStyles.infoBlock, styles.infoBlockBottom)}>
                <div className={landingStyles.infoBlockTitle}>
                  Effortless financial
                  management:
                </div>

                <div className={landingStyles.infoBlockNumber}>4</div>

                <div className={landingStyles.infoBlockContents}>
                  Enjoy a user-friendly experience with
                  swift and secure fiat transactions,
                  ensuring peace of mind while
                  managing your finances.
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>

        {/* Misc container */}
        <div className={styles.miscContainer}>
          <div className={styles.miscContainer}>Fast connect</div>
          <a href="mailto:info@onesatoshiglobal.hk">info@onesatoshiglobal.hk</a>
        </div>
      </div>
    </div>
  );
}
