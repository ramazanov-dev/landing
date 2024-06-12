import classNames from "classnames";
import {useEffect, useState} from "react";
import FileUploader from "~components/FileUploader";
import Icon from "~components/Icon";
import UserModel from "../../models/user.ts";
import onError from "../../utils/on-error.ts";
import KycRightAside from "../KycPage/components/KycRightAside";
import styles from "./index.module.css";

import LoadingWheel from "~components/LoadingWheel";
import mainStore from "../../store/main.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import {getRandomNumber} from "../../utils/misc.ts";

export default function KycPhotoPage() {
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

        setIsFirstUploading(!userData.proofOfPersonalityFile);
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
      !!userData.proofOfPersonalityFile || "You need to upload file"
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
        proofOfPersonalityFile: userData.proofOfPersonalityFile
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

  /* Auto submit */
  useEffect(() => {
    if(!isFirstUploading) return;
    if(!userData?.proofOfPersonalityFile) return;

    onSubmit();
  }, [userData?.proofOfPersonalityFile]);

  /* DOM */
  return userData ? (
    <div className={classNames(styles.KycPhotoPage, "isGray")}>
      <div className="pageHeader">
        <h1>Photo</h1>

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
          Please provide a photo of you holding your passport or ID card.
        </div>

        <div className={styles.description}>
          The picture must also include a hand-written note with the word
          Sterling, today's date, and your signature.
        </div>

        <div className={styles.description}>
          Make sure your face is clearly visible and that all ID document and
          hand-written details are clearly readable.
        </div>

        <div style={{height: 30}} />

        <FileUploader
          isDone={!!userData.proofOfPersonalityFile}
          onDone={(file) => {
            setUserData({...userData, proofOfPersonalityFile: file._id});
          }}
        />
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={3}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  ) : (
    <div className="loading-wheel-wrapper">
      <LoadingWheel size={50} spinsPerSecond={2} width={5} color="#131313" />
    </div>
  );
}
