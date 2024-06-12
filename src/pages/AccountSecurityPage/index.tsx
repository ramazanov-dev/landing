import classNames from "classnames";
import {useState} from "react";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import {getRandomNumber} from "../../utils/misc.ts";
import validate from "../../utils/validate.ts";
import styles from "./index.module.css";

import mainStore from "../../store/main.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import onError from "../../utils/on-error.ts";

function PasswordForm() {
  /* State */
  const [arePasswordsVisible, setArePasswordsVisible] = useState(false);
  const [passwordChangeForm, setPasswordChangeForm] = useState<{
    oldPassword: string;
    password1: string;
    password2: string;
  }>({
    oldPassword: "",
    password1: "",
    password2: ""
  });

  /* On password change form submit */
  function onPasswordChangeFormSubmit() {
    /* Validate user data */
    for(const validation of [
      validate("password", passwordChangeForm.oldPassword, "Old password"),
      validate("password", passwordChangeForm.password1, "New password"),
      validate("password", passwordChangeForm.password2, "Password confirm"),
      passwordChangeForm.password1 === passwordChangeForm.password2 ||
      "Passwords don't match"
    ]) {
      if(typeof validation === "string") {
        return mainStore.addNotification({
          id: getRandomNumber(0, 9999999).toString(16),
          title: "Error",
          contents: validation
        });
      }
    }

    /* Send API request */
    fetch("/users/edit", {
      method: "PUT",
      body: JSON.stringify({
        password: passwordChangeForm.password1
      })
    })
      .then(validateStatus)
      .then(() => {
        return mainStore.addNotification({
          id: getRandomNumber(0, 9999999).toString(16),
          title: "Information",
          contents: "Password changed"
        });
      })
      .catch(onError);
  }

  /* DOM */
  return (
    <div className={classNames("form-container", styles.PasswordForm)}>
      <div className="form-small-tip">
        To change your password, fill in the fields below. We also recommend
        that you pass 2A protection
      </div>

      <div className="form-label">Current password</div>
      <div className="fields-wrapper __hasAfterContents">
        <input
          type={arePasswordsVisible ? "text" : "password"}
          className="isGrayOnDesktop"
          value={passwordChangeForm.oldPassword}
          onChange={({target: {value}}) =>
            setPasswordChangeForm({...passwordChangeForm, oldPassword: value})
          }
        />
        <div
          style={{cursor: "pointer"}}
          onClick={() => setArePasswordsVisible(!arePasswordsVisible)}
        >
          <Icon
            icon={
              arePasswordsVisible
                ? "custom-closed-eye-1"
                : "custom-opened-eye-1"
            }
            style={{stroke: "#292D32"}}
          />
        </div>
      </div>

      <div className="form-label">New password</div>
      <div className="fields-wrapper __hasAfterContents">
        <input
          type={arePasswordsVisible ? "text" : "password"}
          className="isGrayOnDesktop"
          value={passwordChangeForm.password1}
          onChange={({target: {value}}) =>
            setPasswordChangeForm({...passwordChangeForm, password1: value})
          }
        />
        <div
          style={{cursor: "pointer"}}
          onClick={() => setArePasswordsVisible(!arePasswordsVisible)}
        >
          <Icon
            icon={
              arePasswordsVisible
                ? "custom-closed-eye-1"
                : "custom-opened-eye-1"
            }
            style={{stroke: "#292D32"}}
          />
        </div>
      </div>

      <div className="form-label">Confirm new password</div>
      <div className="fields-wrapper __hasAfterContents">
        <input
          type={arePasswordsVisible ? "text" : "password"}
          className="isGrayOnDesktop"
          value={passwordChangeForm.password2}
          onChange={({target: {value}}) =>
            setPasswordChangeForm({...passwordChangeForm, password2: value})
          }
        />
        <div
          style={{cursor: "pointer"}}
          onClick={() => setArePasswordsVisible(!arePasswordsVisible)}
        >
          <Icon
            icon={
              arePasswordsVisible
                ? "custom-closed-eye-1"
                : "custom-opened-eye-1"
            }
            style={{stroke: "#292D32"}}
          />
        </div>
      </div>

      <div style={{height: 10}} />

      <button
        className="isBrown isDuctile"
        onClick={() => onPasswordChangeFormSubmit()}
      >
        <span>Change</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  );
}

function TwoFAForm() {
  return (
    <div className={styles.TwoFAForm}>
      <div className={styles.tfaFormTitle}>Two-factor authentication</div>

      <div className={styles.tfaFormDescription}>
        You can use any application or browser extension that uses a Time-based
        One-time Password Algorithm for Two-Factor Authentication. This page
        shows an example using Google Authenticator's setup. Please be careful
        when linking 2FA to your device: once it is active, you can only make
        changes using the app or extension.
      </div>

      <div className={styles.tfaFormStep}>Step 1</div>

      <div className={styles.tfaFormDescription}>
        Install Google Authentication app to your device
      </div>

      <div className={styles.appButtonsContainer}>
        <a href="#">
          <img src="/assets/images/app-store.svg" alt="" />
        </a>
        <a href="#">
          <img src="/assets/images/google-play.svg" alt="" />
        </a>
      </div>

      <div className={styles.tfaFormStep}>Step 2</div>

      <div className={styles.tfaFormDescription}>
        Scan this QR code with your device
      </div>

      <div className={styles.qrCodeWrapper}>
        <div className={styles.qrCodeContainer}>
          <img src="/assets/images/qr-code.svg" alt="" />
        </div>

        <div className={styles.qrCodeInfo}>
          <span>Otherwise, enter this key for manual activation</span>

          <div className="data-rows">
            <div className="data-rows-item">
              <span>Account</span>
              <span>Tonio LTD</span>
            </div>

            <div className="data-rows-item">
              <span>Account</span>
              <span>Tonio LTD</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tfaFormStep}>Step 3</div>

      <div className={styles.tfaFormDescription}>
        Enter an authentication code from the app here to enable two-factor
        authentication:
      </div>

      <div style={{height: 20}} />

      <div className="form-container">
        <div className="fields-wrapper">
          <input type="text" className="isGrayOnDesktop" />
        </div>
      </div>

      <div style={{height: 40}} />

      <button className="isBrown isDuctile">
        <span>Submit</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  );
}

export default function AccountSecurityPage() {
  /* State */
  const [act, setAct] = useState<"password" | "2fa">("password");

  /* DOM */
  return (
    <div className={classNames(styles.AccountSecurityPage, "isGray")}>
      <div className="pageHeader">
        <h1>Account security</h1>

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

      <div style={{height: 50}} />

      <div className={styles.formWrapper}>
        <div className={styles.formAct}>
          <div className="action-cards-container">
            <div
              className={classNames("action-card", {
                isDark: act === "password"
              })}
              onClick={() => setAct("password")}
            >
              <span>1</span>
              <span>Password</span>
              {act !== "password" && (
                <span style={{color: "#C0976B", textDecoration: "underline"}}>
                  Check
                </span>
              )}
            </div>

            <div
              className={classNames("action-card", {isDark: act === "2fa"})}
              onClick={() => setAct("2fa")}
            >
              <span>2</span>
              <span>Two-factor authentication</span>
              {act !== "2fa" && (
                <span style={{color: "#C0976B", textDecoration: "underline"}}>
                  Check
                </span>
              )}
            </div>
          </div>
        </div>

        {act === "password" ? <PasswordForm /> : <TwoFAForm />}
      </div>
    </div>
  );
}
