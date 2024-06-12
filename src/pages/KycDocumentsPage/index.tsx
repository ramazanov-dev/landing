import classNames from "classnames";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FileUploader from "~components/FileUploader";
import Icon from "~components/Icon";
import LoadingWheel from "~components/LoadingWheel";
import UserModel from "../../models/user.ts";
import onError from "../../utils/on-error.ts";
import KycRightAside from "../KycPage/components/KycRightAside";
import styles from "./index.module.css";

import mainStore from "../../store/main.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import {getRandomNumber} from "../../utils/misc.ts";

export default function KycDocumentsPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* State */
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [isFirstUploading, setIsFirstUploading] = useState<boolean>(true);

  /* Load user data function */
  function loadUserData() {
    fetch("/users/getMe")
      .then(validateStatus)
      .then(({data: userData}) => {
        setUserData(userData);
        setIsFirstUploading(
          !userData.proofOfIdentityFile || !userData.proofOfAddressFile
        );
      })
      .catch(onError);
  }

  /* Init */
  useEffect(() => {
    loadUserData();
  }, []);

  /* On submit */
  function onSubmit() {
    if(!userData) return;

    /* Validate user data */
    for(const validation of [
      (!!userData.proofOfIdentityFile && !!userData.proofOfAddressFile) ||
      "You need to upload both files"
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
        proofOfIdentityFile: userData.proofOfIdentityFile,
        proofOfAddressFile: userData.proofOfAddressFile
      })
    })
      .then(validateStatus)
      .then(() => {
        loadUserData();

        return mainStore.addNotification({
          id: getRandomNumber(0, 9999999).toString(16),
          title: "Successfully updated",
          contents: "Your data has updated"
        });
      })
      .catch(onError);
  }

  /* DOM */
  return userData ? (
    <div className={classNames(styles.KycDocumentsPage, "isGray")}>
      <div className="pageHeader">
        <h1>Documents</h1>

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
        <div className={styles.description} style={{fontWeight: "bold"}}>
          Proof of Identity
        </div>

        <div style={{height: 10}} />

        <div className={styles.description}>
          &mdash; Passport or ID card (for EU citizens);
        </div>

        <div className={styles.description}>
          &mdash; International passport (for other citizens)
        </div>

        <div className={styles.description}>
          The document uploaded for Proof of Identity verification must indicate
          family name and given name(s), date and place of birth, ID number,
          issue and expiry dates, country of issue, and your signature.
        </div>

        <div style={{height: 30}} />

        <FileUploader
          isDone={!!userData.proofOfIdentityFile}
          onDone={(file) =>
            setUserData({...userData, proofOfIdentityFile: file._id})
          }
        />

        <div style={{height: 50}} />

        <div className={styles.description} style={{fontWeight: "bold"}}>
          Proof of Address
        </div>

        <div style={{height: 10}} />

        <div className={styles.description}>
          &mdash; Utility bill (e.g. gas, electricity, water, or other household
          bill);
        </div>

        <div className={styles.description}>&mdash; Bank statement;</div>

        <div className={styles.description}>&mdash; Text or rates bill;</div>

        <div className={styles.description}>
          &mdash; Government-issued certification of residency
        </div>

        <div className={styles.description}>
          The document uploaded for Proof of Address verification must not be
          the same as the Proof of Identity document. Both documents must have
          the same name. A utility bill, tax or rates bill, or bank statement
          must be issued within the last 3 months.
        </div>

        <div className={styles.description}>
          The address in this document should be the same as the address in the
          previous section
        </div>

        <div style={{height: 30}} />

        {/* <button className="isGreen isDuctile"> */}
        {/*   <span>Uploaded</span> */}
        {/*   <Icon icon="custom-check-1" /> */}
        {/* </button> */}

        <FileUploader
          isDone={!!userData.proofOfAddressFile}
          onDone={(file) =>
            setUserData({...userData, proofOfAddressFile: file._id})
          }
        />

        <div style={{height: 50}} />

        <div className="fields-wrapper">
          {isFirstUploading ? (
            <button className="isDuctile isBrown" onClick={() => onSubmit()}>
              <span>Save changes</span>
            </button>
          ) : null}

          <button
            className="isBlack isDuctile"
            onClick={() => $navigate("/kyc/photo")}
          >
            <span>Next step</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={2}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  ) : (
    <div className="loading-wheel-wrapper">
      <LoadingWheel size={50} spinsPerSecond={2} width={5} color="#131313" />
    </div>
  );
}
