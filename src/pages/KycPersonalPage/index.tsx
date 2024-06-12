import classNames from "classnames";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {IMaskInput} from "react-imask";
import Checkbox from "~components/Checkbox";
import Icon from "~components/Icon";
import LoadingWheel from "~components/LoadingWheel";
import CountryModel from "../../models/country.ts";
import UserModel from "../../models/user.ts";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import {getRandomNumber} from "../../utils/misc.ts";
import onError from "../../utils/on-error.ts";
import validate from "../../utils/validate.ts";
import KycRightAside from "../KycPage/components/KycRightAside";
import kycStyles from "../KycPage/index.module.css";
import styles from "./index.module.css";

import {useNavigate} from "react-router-dom";
import mainStore from "../../store/main.ts";

export default function KycPersonalPage() {
  /* Hooks */
  const $navigate = useNavigate();

  /* State */
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [userData, setUserData] = useState<
    | (UserModel & {
    dateOfBirthString: string;
    passportCreatedAtString: string;
    passportExpiryDateString: string;

    phoneNumberString: string;
  })
    | null
  >(null);
  const [countries, setCountries] = useState<CountryModel[]>([]);
  const [agreement, setAgreement] = useState<boolean>(false);

  /* Load user data function */
  function loadUserData() {
    fetch("/users/getMe")
      .then(validateStatus)
      .then(({data: userData}) => {
        setUserData({
          ...userData,
          dateOfBirth: userData.dateOfBirth
            ? DateTime.fromISO(userData.dateOfBirth as unknown as string)
            : null,
          dateOfBirthString: userData.dateOfBirth
            ? (DateTime.fromISO(
              userData.dateOfBirth as unknown as string
            ).toISODate() as string)
            : "",

          passportCreatedAt: userData.passportCreatedAt
            ? DateTime.fromISO(userData.passportCreatedAt as unknown as string)
            : null,
          passportCreatedAtString: userData.passportCreatedAt
            ? (DateTime.fromISO(
              userData.passportCreatedAt as unknown as string
            ).toISODate() as string)
            : "",

          passportExpiryDate: userData.passportExpiryDate
            ? DateTime.fromISO(userData.passportExpiryDate as unknown as string)
            : null,
          passportExpiryDateString: userData.passportExpiryDate
            ? (DateTime.fromISO(
              userData.passportExpiryDate as unknown as string
            ).toISODate() as string)
            : "",

          phoneNumberString: userData.phoneNumber
        });
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
    if(!userData) return;
    if(!agreement) {
      return mainStore.addNotification({
        id: getRandomNumber(0, 9999999).toString(16),
        title: "Error",
        contents: "You must agree this form"
      });
    }

    const rawPhoneNumber = `+${userData.phoneNumberString.replace(/\D/g, "")}`;
    const dateOfBirth = new Date(userData.dateOfBirthString);
    const passportCreatedAt = new Date(userData.passportCreatedAtString);
    const passportExpiryDate = new Date(userData.passportExpiryDateString);

    /* Validate user data */
    for(const validation of [
      validate("phoneNumber", rawPhoneNumber, "Phone number"),
      validate("email", userData.email, "E-Mail"),
      validate("comment256", userData.title || "Other", "Title"),
      validate("personName", userData.firstName, "First Name"),
      validate("personName", userData.lastName, "Last Name"),
      validate("date", dateOfBirth, "Date of Birth"),
      validate("comment256", userData.placeOfBirth, "Place of Birth"),
      validate("comment256", userData.taxNumber, "Tax number"),
      validate("comment256", userData.passportNumber, "Passport number"),
      validate("date", passportCreatedAt, "Passport issued date"),
      validate("date", passportExpiryDate, "Passport expiry date")
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
      method: "POST",
      body: JSON.stringify({
        email: userData.email,
        phoneNumber: rawPhoneNumber,
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName || undefined,
        dateOfBirth,
        placeOfBirth: userData.placeOfBirth,
        taxNumber: userData.taxNumber,
        passportNumber: userData.passportNumber,
        passportCreatedAt,
        passportExpiryDate
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
  return userData && countries.length ? (
    <div className={classNames(styles.KycPersonalPage, "isGray")}>
      <div className="pageHeader">
        <h1>Personal information</h1>

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
            <div className="form-label">Title</div>
            <div className="fields-wrapper __hasAfterContents">
              <select
                value={userData.title}
                onChange={({target: {value}}) =>
                  setUserData({...userData, title: value})
                }
              >
                <option value="mr">Mr.</option>
                <option value="mrs">Mrs.</option>
                <option value="other">Other</option>
              </select>
              <div>
                <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
              </div>
            </div>
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Other</div>
            <input
              type="text"
              value={userData.title}
              onChange={({target: {value}}) =>
                setUserData({...userData, title: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">First name*</div>
            <input
              type="text"
              value={userData.firstName}
              onChange={({target: {value}}) =>
                setUserData({...userData, firstName: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Last name*</div>
            <input
              type="text"
              value={userData.lastName}
              onChange={({target: {value}}) =>
                setUserData({...userData, lastName: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">
              Middle name (leave empty if have no)
            </div>
            <input
              type="text"
              value={userData.middleName}
              onChange={({target: {value}}) =>
                setUserData({...userData, middleName: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Date of birth*</div>
            <IMaskInput
              type="text"
              mask="0000-00-00"
              placeholder="0000-00-00"
              value={userData.dateOfBirthString}
              onAccept={(value) =>
                setUserData({...userData, dateOfBirthString: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Place of birth*</div>
            <input
              type="text"
              value={userData.placeOfBirth}
              onChange={({target: {value}}) =>
                setUserData({...userData, placeOfBirth: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Citizenship</div>
            <div className="fields-wrapper __hasAfterContents">
              <select
                value={userData.citizenship ?? countries[0]._id}
                onChange={({target: {value}}) =>
                  setUserData({...userData, citizenship: value})
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

          <div style={{flex: 1}} />
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Tax number*</div>
            <input
              type="text"
              value={userData.taxNumber}
              onChange={({target: {value}}) =>
                setUserData({...userData, taxNumber: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Tax residency</div>
            <div className="fields-wrapper __hasAfterContents">
              <select
                value={userData.taxResidency ?? countries[0]._id}
                onChange={({target: {value}}) =>
                  setUserData({...userData, taxResidency: value})
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
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Passport or ID card number*</div>
            <input
              type="text"
              value={userData.passportNumber}
              onChange={({target: {value}}) =>
                setUserData({...userData, passportNumber: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">
              Password or ID card issuing country
            </div>
            <div className="fields-wrapper __hasAfterContents">
              <select
                value={userData.passportCreatedByCountry ?? countries[0]._id}
                onChange={({target: {value}}) =>
                  setUserData({...userData, passportCreatedByCountry: value})
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
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Date of issue*</div>
            <IMaskInput
              type="text"
              mask="0000-00-00"
              placeholder="0000-00-00"
              value={userData.passportCreatedAtString}
              onAccept={(value) =>
                setUserData({...userData, passportCreatedAtString: value})
              }
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Expiry date*</div>
            <IMaskInput
              type="text"
              mask="0000-00-00"
              placeholder="0000-00-00"
              value={userData.passportExpiryDateString}
              onAccept={(value) =>
                setUserData({...userData, passportExpiryDateString: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <div className="fields-wrapper">
            <div className="form-label">Phone number*</div>
            <IMaskInput
              type="text"
              placeholder="+79..."
              value={userData.phoneNumberString}
              mask="+{7}-(000)-000-00-00"
              onAccept={(value) => {
                setUserData({...userData, phoneNumberString: value});
              }}
            />
          </div>

          <div className="fields-wrapper">
            <div className="form-label">Email*</div>
            <input
              type="text"
              value={userData.email}
              onChange={({target: {value}}) =>
                setUserData({...userData, email: value})
              }
            />
          </div>
        </div>

        <div className="fields-wrapper">
          <Checkbox
            isActive={agreement}
            onChange={() => setAgreement(!agreement)}
            contents="I agree with everything"
          />
        </div>

        <div className="fields-wrapper">
          <button className="isDuctile isBrown" onClick={() => onSubmit()}>
            <span>Save changes</span>
          </button>

          <button
            className="isBlack isDuctile"
            onClick={() => $navigate("/kyc/address")}
          >
            <span>Next step</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>
      </div>

      {/* Right aside */}
      <KycRightAside
        isActive={isAsideActive}
        stepsPassed={0}
        onClose={() => setIsAsideActive(false)}
      />
    </div>
  ) : (
    <div className="loading-wheel-wrapper">
      <LoadingWheel size={50} spinsPerSecond={2} width={5} color="#131313" />
    </div>
  );
}
