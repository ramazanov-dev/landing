import classNames from "classnames";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Checkbox from "~components/Checkbox";
import Icon from "~components/Icon";
import LoadingWheel from "~components/LoadingWheel";
import CountryModel from "../../models/country.ts";
import UserModel from "../../models/user.ts";
import onError from "../../utils/on-error.ts";
import validate from "../../utils/validate.ts";
import KycRightAside from "../KycPage/components/KycRightAside";
import kycStyles from "../KycPage/index.module.css";
import styles from "./index.module.css";

import mainStore from "../../store/main.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import {getRandomNumber} from "../../utils/misc.ts";

export default function KycAddressPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* State */
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserModel | null>(null);
  const [countries, setCountries] = useState<CountryModel[]>([]);

  /* Load user data function */
  function loadUserData() {
    fetch("/users/getMe")
      .then(validateStatus)
      .then(({data: userData}) => {
        setUserData(userData);
      })
      .catch(onError);
  }

  /* Load countries */
  function loadCountries() {
    fetch("/countries/getList")
      .then(validateStatus)
      .then(({data: countries}) => {
        setCountries(countries);
      })
      .catch(onError);
  }

  /* Init */
  useEffect(() => {
    loadUserData();
    loadCountries();
  }, []);

  /* On submit */
  function onSubmit() {
    if(!userData?.permanentAddress || !userData.residentialAddress) return;

    /* Validate user data */
    for(const validation of [
      validate(
        "comment256",
        userData.permanentAddress.city,
        "Permanent address / city"
      ),
      validate(
        "comment256",
        userData.permanentAddress.street,
        "Permanent address / street"
      ),
      validate(
        "comment256",
        userData.permanentAddress.buildingNumber,
        "Permanent address / building number"
      ),
      validate(
        "comment256",
        userData.permanentAddress.apartmentNumber,
        "Permanent address / apartment number"
      ),
      validate(
        "comment256",
        userData.permanentAddress.zipCode,
        "Permanent address / zip code"
      ),

      ...(!isSameAddress
        ? [
          validate(
            "comment256",
            userData.residentialAddress.city,
            "Residential address / city"
          ),
          validate(
            "comment256",
            userData.residentialAddress.street,
            "Residential address / street"
          ),
          validate(
            "comment256",
            userData.residentialAddress.buildingNumber,
            "Residential address / building number"
          ),
          validate(
            "comment256",
            userData.residentialAddress.apartmentNumber,
            "Residential address / apartment number"
          ),
          validate(
            "comment256",
            userData.residentialAddress.zipCode,
            "Residential address / zip code"
          )
        ]
        : [])
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
        permanentAddress: userData.permanentAddress,
        ...(isSameAddress
          ? {
            residentialAddress: userData.permanentAddress
          }
          : {
            residentialAddress: userData.residentialAddress
          })
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
  return userData && countries.length && userData.permanentAddress ? (
    <div className={classNames(styles.KycAddressPage, "isGray")}>
      <div className="pageHeader">
        <h1>Address</h1>

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
        <div className="form-small-tip" style={{fontWeight: "bold"}}>
          Permanent address
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Country</div>
            <div className="fields-wrapper __hasAfterContents">
              <select
                value={userData.permanentAddress.country ?? countries[0]._id}
                onChange={({target: {value}}) =>
                  setUserData({
                    ...userData,
                    permanentAddress: {
                      ...userData!.permanentAddress!,
                      country: value
                    }
                  })
                }
              >
                {countries.map((country) => (
                  <option key={country._id} value={country._id}>
                    {country.generalName}
                  </option>
                ))}
              </select>
              <div>
                <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
              </div>
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="form-label">City/Town*</div>
            <input
              type="text"
              value={userData.permanentAddress.city}
              onChange={({target: {value}}) =>
                setUserData({
                  ...userData,
                  permanentAddress: {
                    ...userData!.permanentAddress!,
                    city: value
                  }
                })
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Street name*</div>
            <input
              type="text"
              value={userData.permanentAddress.street}
              onChange={({target: {value}}) =>
                setUserData({
                  ...userData,
                  permanentAddress: {
                    ...userData!.permanentAddress!,
                    street: value
                  }
                })
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Building name / House number</div>
            <input
              type="text"
              value={userData.permanentAddress.buildingNumber}
              onChange={({target: {value}}) =>
                setUserData({
                  ...userData,
                  permanentAddress: {
                    ...userData!.permanentAddress!,
                    buildingNumber: value
                  }
                })
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Apartment number</div>
            <input
              type="text"
              value={userData.permanentAddress.apartmentNumber}
              onChange={({target: {value}}) =>
                setUserData({
                  ...userData,
                  permanentAddress: {
                    ...userData!.permanentAddress!,
                    apartmentNumber: value
                  }
                })
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Postal / Zip code</div>
            <input
              type="text"
              value={userData.permanentAddress.zipCode}
              onChange={({target: {value}}) =>
                setUserData({
                  ...userData,
                  permanentAddress: {
                    ...userData!.permanentAddress!,
                    zipCode: value
                  }
                })
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">&nbsp;</div>
            <div className="fields-wrapper" style={{marginTop: -30}}>
              <Checkbox
                isActive={isSameAddress}
                onChange={() => setIsSameAddress(!isSameAddress)}
                contents="My residentional address is the same"
              />
            </div>
          </div>

          <div style={{flex: 1}} />
        </div>

        {!isSameAddress ? (
          <>
            <div style={{height: 30}} />

            <div className="form-small-tip" style={{fontWeight: "bold"}}>
              Residential address
            </div>

            <div className="fields-wrapper">
              <div className="fields-wrapper">
                <div className="form-label">Country</div>
                <div className="fields-wrapper __hasAfterContents">
                  <select
                    value={
                      userData.residentialAddress!.country ?? countries[0]._id
                    }
                    onChange={({target: {value}}) =>
                      setUserData({
                        ...userData,
                        residentialAddress: {
                          ...userData!.residentialAddress!,
                          country: value
                        }
                      })
                    }
                  >
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                        {country.generalName}
                      </option>
                    ))}
                  </select>
                  <div>
                    <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
                  </div>
                </div>
              </div>

              <div className="fields-wrapper">
                <div className="form-label">City/Town*</div>
                <input
                  type="text"
                  value={userData.residentialAddress!.city}
                  onChange={({target: {value}}) =>
                    setUserData({
                      ...userData,
                      residentialAddress: {
                        ...userData!.residentialAddress!,
                        city: value
                      }
                    })
                  }
                />
              </div>
            </div>

            <div className="fields-wrapper">
              <div className="fields-wrapper">
                <div className="form-label">Street name*</div>
                <input
                  type="text"
                  value={userData.residentialAddress!.street}
                  onChange={({target: {value}}) =>
                    setUserData({
                      ...userData,
                      residentialAddress: {
                        ...userData!.residentialAddress!,
                        street: value
                      }
                    })
                  }
                />
              </div>

              <div className="fields-wrapper">
                <div className="form-label">Building name / House number</div>
                <input
                  type="text"
                  value={userData.residentialAddress!.buildingNumber}
                  onChange={({target: {value}}) =>
                    setUserData({
                      ...userData,
                      residentialAddress: {
                        ...userData!.residentialAddress!,
                        buildingNumber: value
                      }
                    })
                  }
                />
              </div>
            </div>

            <div className="fields-wrapper">
              <div className="fields-wrapper">
                <div className="form-label">Apartment number</div>
                <input
                  type="text"
                  value={userData.residentialAddress!.apartmentNumber}
                  onChange={({target: {value}}) =>
                    setUserData({
                      ...userData,
                      residentialAddress: {
                        ...userData!.residentialAddress!,
                        apartmentNumber: value
                      }
                    })
                  }
                />
              </div>

              <div className="fields-wrapper">
                <div className="form-label">Postal / Zip code</div>
                <input
                  type="text"
                  value={userData!.residentialAddress!.zipCode}
                  onChange={({target: {value}}) =>
                    setUserData({
                      ...userData,
                      residentialAddress: {
                        ...userData!.residentialAddress!,
                        zipCode: value
                      }
                    })
                  }
                />
              </div>
            </div>
          </>
        ) : null}

        <div style={{height: 30}} />

        <div className="fields-wrapper">
          <button className="isDuctile isBrown" onClick={() => onSubmit()}>
            <span>Save changes</span>
          </button>

          <button
            className="isBlack isDuctile"
            onClick={() => $navigate("/kyc/documents")}
          >
            <span>Next step</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={1}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  ) : (
    <div className="loading-wheel-wrapper">
      <LoadingWheel size={50} spinsPerSecond={2} width={5} color="#131313" />
    </div>
  );
}
