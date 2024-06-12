import classNames from "classnames";
import React from "react";
import {useNavigate} from "react-router-dom";
import Icon from "~components/Icon";
import styles from "./index.module.css";

import mainStore from "../../../../store/main";


export default function WelcomeBlock() {
  /* Hooks */
  const $navigate = useNavigate();

  /* DOM */
  return (
    <div id="welcome" className={styles.WelcomeBlock}>
      {/* Block contents */}
      <div className={styles.container}>
        <div className={styles.blockContents}>
          <h1>Welcome to One Satoshi Global!</h1>

          <h2>
            Empower your <br />
            crypto management experience with OSG
          </h2>

          {mainStore.sessionToken ? (
            <button
              className={classNames("isDuctile isBlack", styles.blockContentsBtn)}
              onClick={() => $navigate("/wallet")}
            >
              <div className={styles.blockContentsBtnText}>Open account</div>
              <div className={styles.blockContentsBtnIcon}>
                <Icon icon="custom-arrow-top-right-1" />
              </div>
            </button>

          ) : (
            <button
              className={classNames("isDuctile isBlack", styles.blockContentsBtn)}
              onClick={() => $navigate("/login")}
            >
              <span>Sign In</span>
            </button>
          )}

          {/* Small info block */}
          <div className={styles.smallInfoBlock}>
            <div className={styles.smallInfoBlockContents}>
              We provide users with convenient
              and secure solutions for storing
              and converting cryptocurrencies
            </div>
            <div className={styles.smallInfoBlockIcon}>
              <Icon icon="custom-arrow-2" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
