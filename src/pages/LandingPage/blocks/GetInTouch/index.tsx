import classNames from "classnames";
import Icon from "~components/Icon";
import landingStyles from "../../index.module.css";
import styles from "./index.module.css";

export default function GetInTouchBlock() {
  /* DOM */
  return (
    <div id="about-us" className={styles.GetInTouch}>
      <div className={styles.container}>
        <div className={styles.infoBlocksContainer}>

          <div className={classNames(landingStyles.infoBlock, styles.infoBlockWhite)}>
            <div className={classNames(landingStyles.infoBlockTitle, styles.infoBlockTitle)}>
              Join Now
            </div>

            <div className={landingStyles.infoBlockNumber}>
              <Icon icon="custom-arrow-top-right-1" />
            </div>

            <div className={landingStyles.infoBlockContents}>
              Start managing your assets by signing up for our crypto platform.
            </div>
          </div>
          <div className={classNames(landingStyles.infoBlock)}>
            <div className={classNames(landingStyles.infoBlockTitle, styles.infoBlockTitle)}>
              Get in Touch
            </div>

            <div className={landingStyles.infoBlockNumber}>
              <Icon icon="custom-arrow-top-right-1" />
            </div>

            <div className={landingStyles.infoBlockContents}>
              Connect with us in Georgian, Chinese, or English for assistance and information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
