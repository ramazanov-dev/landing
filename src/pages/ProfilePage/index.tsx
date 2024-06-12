import classNames from "classnames";
import {useEffect, useState} from "react";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import UserModel from "../../models/user.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import onError from "../../utils/on-error.ts";
import styles from "./index.module.css";

export default function ProfilePage() {
  /* State */
  const [userData, setUserData] = useState<UserModel | null>(null);

  /* Load user data function */
  function loadUserData() {
    fetch("/users/getMe")
      .then(validateStatus)
      .then(({data: userData}) => {
        setUserData(userData);
      })
      .catch(onError);
  }

  /* Init */
  useEffect(() => {
    loadUserData();
  }, []);

  /* DOM */
  return userData ? (
    <div className={classNames(styles.ProfilePage, "isGray")}>
      <div className="pageHeader">
        <h1>User info</h1>

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

      <div className={styles.fullName}>
        {userData.firstName
          ? `${userData.firstName} ${userData.lastName}`
          : "(No name)"}
      </div>

      <div style={{height: 30}} />

      <div className="data-rows isUnderlined" style={{maxWidth: 600}}>
        <div className="data-rows-item">
          <span>Client ID</span>
          <span>{userData._id}</span>
        </div>

        <div className="data-rows-item">
          <span>E-Mail</span>
          <span>{userData.email}</span>
        </div>

        <div className="data-rows-item">
          <span>Phone number</span>
          <span>{userData.phoneNumber}</span>
        </div>

        <div className="data-rows-item">
          <span>Access level</span>
          <span>Verified</span>
        </div>

        <div className="data-rows-item">
          <span>Account type</span>
          <span>Personal</span>
        </div>
      </div>
    </div>
  ) : null;
}
