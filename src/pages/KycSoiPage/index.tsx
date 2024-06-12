import classNames from "classnames";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Checkbox from "~components/Checkbox";
import FileUploader from "~components/FileUploader";
import Icon from "~components/Icon";
import LoadingWheel from "~components/LoadingWheel";
import UserModel from "../../models/user.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import onError from "../../utils/on-error.ts";
import validate from "../../utils/validate.ts";
import KycRightAside from "../KycPage/components/KycRightAside";
import kycStyles from "../KycPage/index.module.css";
import styles from "./index.module.css";

import mainStore from "../../store/main.ts";
import {getRandomNumber} from "../../utils/misc.ts";

export default function KycSoiPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* State */
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [userData, setUserData] = useState<
    | (UserModel & {
    soiArray: string[];
  })
    | null
  >(null);

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

  /* On submit */
  function onSubmit() {
    if(!userData) return;

    /* Validate user data */
    for(const validation of [
      validate("comment256", userData.soiDescription, "Income description"),
      validate("comment256", userData.annualRevenue, "Annual revenue"),
      (!!userData.proofOfSoiFile && !!userData.proofOfTaxDeclarationFile) ||
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
        soiDescription: userData.soiDescription,
        soiArray: userData.soiArray,
        soiString: userData.soiString,
        annualRevenue: userData.annualRevenue,
        proofOfSoiFile: userData.proofOfSoiFile,
        proofOfTaxDeclarationFile: userData.proofOfTaxDeclarationFile
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
    <div className={classNames(styles.KycSoiPage, "isGray")}>
      <div className="pageHeader">
        <h1>Source of income</h1>

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

      <div style={{height: 30}} />

      <div className={classNames("form-container", kycStyles.kycForm)}>
        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Describe your source of income</div>
            <input
              type="text"
              value={userData.soiDescription}
              onChange={({target: {value}}) =>
                setUserData({...userData, soiDescription: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Amount of your annual income</div>
            <div className="fields-wrapper __hasAfterContents">
              <input
                type="text"
                value={userData.annualRevenue}
                onChange={({target: {value}}) =>
                  setUserData({...userData, annualRevenue: value})
                }
              />
              <div style={{color: "#959595", pointerEvents: "none"}}>EUR</div>
            </div>
          </div>
        </div>

        <div className={styles.description}>
          Please identify the source of income / origin of assets to be
          de-posited in the account by the beneficial owner/s, please select one
          or more that apply:
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Employment (Salary)")}
                onChange={() => {
                  if(userData.soiArray.includes("Employment (Salary)")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Employment (Salary)"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Employment (Salary)"]
                    });
                  }
                }}
                contents="Employment (Salary)"
              />
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Business")}
                onChange={() => {
                  if(userData.soiArray.includes("Business")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Business"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Business"]
                    });
                  }
                }}
                contents="Business"
              />
            </div>
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Wages")}
                onChange={() => {
                  if(userData.soiArray.includes("Wages")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Wages"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Wages"]
                    });
                  }
                }}
                contents="Wages"
              />
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Investment")}
                onChange={() => {
                  if(userData.soiArray.includes("Investment")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Investment"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Investment"]
                    });
                  }
                }}
                contents="Investment"
              />
            </div>
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Inheritance/Gift")}
                onChange={() => {
                  if(userData.soiArray.includes("Inheritance/Gift")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Inheritance/Gift"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Inheritance/Gift"]
                    });
                  }
                }}
                contents="Inheritance/Gift"
              />
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Dividents")}
                onChange={() => {
                  if(userData.soiArray.includes("Dividents")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Dividents"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Dividents"]
                    });
                  }
                }}
                contents="Dividents"
              />
            </div>
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Rent/Lease")}
                onChange={() => {
                  if(userData.soiArray.includes("Rent/Lease")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Rent/Lease"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Rent/Lease"]
                    });
                  }
                }}
                contents="Rent/Lease"
              />
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Sale of Property")}
                onChange={() => {
                  if(userData.soiArray.includes("Sale of Property")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Sale of Property"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Sale of Property"]
                    });
                  }
                }}
                contents="Sale of Property"
              />
            </div>
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="fields-wrapper">
              <Checkbox
                isActive={userData.soiArray.includes("Pension/Retiremen")}
                onChange={() => {
                  if(userData.soiArray.includes("Pension/Retiremen")) {
                    setUserData({
                      ...userData,
                      soiArray: userData.soiArray.filter(
                        (soi) => soi !== "Pension/Retiremen"
                      )
                    });
                  } else {
                    setUserData({
                      ...userData,
                      soiArray: [...userData!.soiArray, "Pension/Retiremen"]
                    });
                  }
                }}
                contents="Pension/Retiremen"
              />
            </div>
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Other</div>
            <input
              type="text"
              value={userData.soiString}
              onChange={({target: {value}}) =>
                setUserData({...userData, soiString: value})
              }
            />
          </div>

          <div style={{flex: 1}} />
        </div>

        <div />

        <div className={styles.description} style={{fontWeight: "bold"}}>
          Upload Source of Income and Tax Declaration to get the Gold Status
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            width: "100%"
          }}
        >
          <div style={{flex: 1}}>
            <div className={styles.description}>Source of income</div>

            <div style={{height: 20}} />

            <div className={styles.description} style={{fontSize: ".9em"}}>
              &mdash; Bank statement
            </div>

            <div className={styles.description} style={{fontSize: ".9em"}}>
              &mdash; Certificate of income or payslips
            </div>

            <div className={styles.description} style={{fontSize: ".9em"}}>
              &mdash; Other financial statement
            </div>

            <div style={{height: 20}} />

            <FileUploader
              isDone={!!userData.proofOfSoiFile}
              onDone={(file) =>
                setUserData({...userData, proofOfSoiFile: file._id})
              }
            />
          </div>

          <div style={{flex: 1}}>
            <div className={styles.description}>Tax declaration</div>

            <div style={{height: 20}} />

            <FileUploader
              isDone={!!userData.proofOfTaxDeclarationFile}
              onDone={(file) =>
                setUserData({
                  ...userData,
                  proofOfTaxDeclarationFile: file._id
                })
              }
            />
          </div>
        </div>

        <div style={{height: 50}} />

        <div className="fields-wrapper">
          <button className="isDuctile isBrown" onClick={() => onSubmit()}>
            <span>Save changes</span>
          </button>

          <button
            className="isBlack isDuctile"
            onClick={() => $navigate("/kyc/done")}
          >
            <span>Submit</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={4}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  ) : (
    <div className="loading-wheel-wrapper">
      <LoadingWheel size={50} spinsPerSecond={2} width={5} color="#131313" />
    </div>
  );
}
