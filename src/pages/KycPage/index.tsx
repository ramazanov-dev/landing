import classNames from "classnames";
import {useNavigate} from "react-router-dom";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import styles from "./index.module.css";

export default function KycPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* DOM */
  return (
    <div className={classNames(styles.KycPage, "isGray")}>
      <div className="pageHeader">
        <h1>Identity verification</h1>

        <div className="pageNav">
          <NavButton to="/profile">
            <Icon icon="custom-user-1" />
          </NavButton>

          <NavButton to="/kyc">
            <Icon icon="custom-scan-1" />
          </NavButton>

          <NavButton to="/account-security">
            <Icon icon="custom-shield-1" />
          </NavButton>
        </div>
      </div>

      <div style={{height: 30}} />

      <div className="data-rows isUnderlined" style={{maxWidth: 600}}>
        <div className="data-rows-item">
          <span>Access level</span>
          <span>Verified</span>
        </div>

        <div className="data-rows-item">
          <span>Account type</span>
          <span>Personal</span>
        </div>
      </div>

      <div style={{height: 50}} />

      <div
        className="action-cards-container"
        style={{justifyContent: "space-evenly"}}
      >
        <div className="action-card" onClick={() => $navigate("/kyc/personal")}>
          <span>1</span>
          <span>Personal information</span>
          <span className="red-text">Not verified</span>
        </div>

        <div className="action-card" onClick={() => $navigate("/kyc/address")}>
          <span>2</span>
          <span>Address</span>
          <span className="red-text">Not verified</span>
        </div>

        <div
          className="action-card"
          onClick={() => $navigate("/kyc/documents")}
        >
          <span>3</span>
          <span>Documents</span>
          <span className="red-text">Not verified</span>
        </div>

        <div className="action-card" onClick={() => $navigate("/kyc/photos")}>
          <span>4</span>
          <span>Photos</span>
          <span className="red-text">Not verified</span>
        </div>

        <div className="action-card" onClick={() => $navigate("/kyc/soi")}>
          <span>5</span>
          <span>Source of income</span>
          <span className="red-text">Not verified</span>
        </div>
      </div>

      <div style={{height: 50}} className="hide-on-mobile" />

      <button
        className="isBrown isDuctile hide-on-mobile"
        onClick={() => $navigate("/kyc/personal")}
      >
        <span>Start verification</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  );
}
