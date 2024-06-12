import classNames from "classnames";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Icon from "~components/Icon";
import KycRightAside from "../KycPage/components/KycRightAside";
import styles from "./index.module.css";

export default function KycDonePage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* State */
  const [isAsideActive, setIsAsideActive] = useState(false);

  /* DOM */
  return (
    <div className={classNames(styles.KycDonePage, "isGray")}>
      <div className="pageHeader">
        <h1>Congratulations</h1>

        <div className="pageNav">
          <button
            className="isBlack isDuctile isNarrow"
            style={{
              padding: 10,
              borderRadius: 12
            }}
            onClick={() => setIsAsideActive(true)}
          >
            <Icon icon="custom-menu-1" />
          </button>
        </div>
      </div>

      <div style={{marginTop: 30, maxWidth: 800}}>
        <div style={{height: 10}} />

        <div className={styles.description}>
          Thank you for submitting your application for onboarding at
          RichDragon. Usually it takes up to 72 hours for our compliance team to
          review the application. Any status update will be sent to your email,
          as well as displayed in your account.
        </div>

        <div className={styles.description}>
          Please click "Agree" button to confirm the application. You will be
          redirected to the account dashboard page
        </div>

        <div style={{height: 30}} />

        <button className="isBlack isDuctile" onClick={() => $navigate("/")}>
          <span>Agree</span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={5}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  );
}
