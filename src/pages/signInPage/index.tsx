import styles from "./index.module.css";

import classNames from "classnames";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Icon from "~components/Icon";
import validate from "../../utils/validate.ts";
import bgImg from "./assets/images/background.png";

import {useQuery} from "@tanstack/react-query";
import {DateTime} from "luxon";
import {IMaskInput} from "react-imask";
import mainStore from "../../store/main";
import {fetch, validateStatus} from "../../utils/fetch.ts";
import {getRandomNumber} from "../../utils/misc.ts";
import onError from "../../utils/on-error.ts";

/* Act / Welcome */
export function ActWelcome() {
  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  const {data: geoInfo, isSuccess: isPhoneSuccess} = useQuery<{
    phoneCode: string;
    countryCode: string;
  }>({
    queryKey: ["/client/auth/sms/number_code"],
    staleTime: 1000 * 60
  });

  /* State */
  const flagCode = geoInfo?.countryCode;
  const [smsVerifyForm, setSmsVerifyForm] = useState<{phoneNumber: string}>({
    phoneNumber: `+${geoInfo?.phoneCode}`
  });

  /* On form submit */
  function onFormSubmit() {
    const rawPhoneNumber = `+${smsVerifyForm.phoneNumber.replace(/\D/g, "")}`;

    /* Validate user data */
    for(const validation of [
      validate("phoneNumber", rawPhoneNumber, "Phone number")
    ]) {
      if(typeof validation === "string") {
        return mainStore.addNotification({
          id: getRandomNumber(0, 9999999).toString(16),
          title: "Error",
          contents: validation
        });
      }
    }

    /* Refer to SMS verify page */
    $setParams(
      new URLSearchParams({
        ...$params,
        act: "smsVerify",
        phoneNumber: rawPhoneNumber,
        proceedTo: "createAccount"
      })
    );
  }

  /* DOM */
  return !isPhoneSuccess ? null : (
    <div className={styles.formContainer}>
      <h1>Create your account</h1>

      <div style={{height: 15}} />

      <div className={styles.tip}>Enter your phone number</div>

      <div style={{height: 50}} />

      <div className="form-container">
        <div
          className="fields-wrapper"
          style={{gap: 10, alignItems: "center"}}
        >
          <img
            src={`https://flagcdn.com/32x24/${flagCode?.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/64x48/${flagCode?.toLowerCase()}.png 2x,
    https://flagcdn.com/96x72/${flagCode?.toLowerCase()}.png 3x`}
            width="32"
            height="24"
            alt={`${geoInfo.countryCode}`}
            style={{
              width: "32px",
              height: "24px",
              transform: "translate(8px, 0)"
            }}
          />
          <IMaskInput
            type="text"
            placeholder={`+${geoInfo.phoneCode}...`}
            value={smsVerifyForm.phoneNumber}
            mask={`+{${geoInfo.phoneCode}}-(000)-000-00-00`}
            onAccept={(value) => {
              setSmsVerifyForm({...smsVerifyForm, phoneNumber: value});
            }}
            style={{textIndent: "56px", marginLeft: -56}}
            required
          />
          <button
            className="isDuctile isBlack isNarrow"
            style={{borderRadius: 12, padding: 20}}
            onClick={() => onFormSubmit()}
          >
            <Icon
              icon="custom-arrow-left-1"
              style={{transform: `rotateZ(180deg)`}}
            />
          </button>
        </div>
        <div className="fields-wrapper">
          <button
            className="isZeroed"
            onClick={() =>
              $setParams(new URLSearchParams({...$params, act: "signIn"}))
            }
          >
            <span>Already have an account? Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Act / Sms-verify */
export function ActSmsVerify() {
  /* Vars */
  const smsCdInSeconds =
    mainStore.smsConfirmationCooldown?.diffNow("seconds").seconds ?? 0;

  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  /* State */
  const [_, setRerender] = useState<string>(Date.now().toString());
  const phoneNumber = $params.get("phoneNumber") ?? null;
  const proceedTo = $params.get("proceedTo") ?? null;
  const [itsAllowedToRender, setItsAllowedToRender] = useState<boolean>(false);
  const [smsVerifyForm, setSmsVerifyForm] = useState<{
    verificationCode: string;
  }>({
    verificationCode: ""
  });

  /* Rerender component every second */
  useEffect(() => {
    if(!mainStore.smsConfirmationCooldown || smsCdInSeconds <= 0) return;

    const int = setInterval(() => {
      setRerender(Date.now().toString());

      if(smsCdInSeconds <= 0) clearInterval(int);
    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, [mainStore.smsConfirmationCooldown]);

  /* Init */
  function init() {
    if(!phoneNumber || !proceedTo) {
      return $setParams(
        new URLSearchParams({
          act: "welcome"
        })
      );
    }

    /* Send API request */
    fetch("/smsConfirmations/create", {
      method: "POST",
      body: JSON.stringify({phoneNumber})
    })
      .then(validateStatus)
      .then(() => {
        /* Set next sms confirmation cooldown */
        mainStore.setSmsConfirmationCooldown(
          DateTime.now().plus({minutes: 3})
        );

        /* Allow to render page */
        setItsAllowedToRender(true);
      })
      .catch(onError);
  }

  /* Run init function */
  useEffect(() => {
    init();
  }, []);

  /* On submit */
  function onFormSubmit() {
    const rawVerificationCode = smsVerifyForm.verificationCode.replace(
      /\D/g,
      ""
    );

    /* Validate user data */
    for(const validation of [
      /\d{6}/.test(rawVerificationCode) || "Incorrect verification code"
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
    fetch("/smsConfirmations/confirm", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber,
        verificationCode: rawVerificationCode
      })
    })
      .then(validateStatus)
      .then(({data: verificationToken}) => {
        $setParams(
          new URLSearchParams({
            act: proceedTo as string,
            phoneNumber: phoneNumber as string,
            verificationToken
          })
        );
      })
      .catch(onError);
  }

  /* DOM */
  return itsAllowedToRender ? (
    <div className={styles.formContainer}>
      <h1>Create your account</h1>

      <div style={{height: 15}} />

      <div className={styles.tip}>
        Enter your 6 digit code from SMS
        <br />({phoneNumber})
      </div>

      <div style={{height: 50}} />

      <div className="form-container">
        <div className="fields-wrapper" style={{gap: 10}}>
          <IMaskInput
            type="text"
            placeholder="000-000"
            value={smsVerifyForm.verificationCode}
            mask="000-000"
            onAccept={(value) =>
              setSmsVerifyForm({...smsVerifyForm, verificationCode: value})
            }
          />
          <button
            className="isDuctile isBlack isNarrow"
            style={{borderRadius: 12, padding: 20}}
            onClick={() => onFormSubmit()}
          >
            <Icon
              icon="custom-arrow-left-1"
              style={{transform: `rotateZ(180deg)`}}
            />
          </button>
        </div>

        <div className="fields-wrapper">
          <button
            className="isZeroed"
            onClick={() =>
              $setParams(new URLSearchParams({...$params, act: "welcome"}))
            }
          >
            <span>Change number</span>
          </button>

          {smsCdInSeconds > 0 ? (
            <button disabled className="isZeroed">
              <span>
                Next SMS request will be able after{" "}
                {new Date(smsCdInSeconds * 1000)
                  .toISOString()
                  .substring(14, 19)}
              </span>
            </button>
          ) : (
            <button className="isZeroed" onClick={() => init()}>
              <span>Request SMS again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

/* Act / Create account */
export function ActCreateAccount() {
  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  /* State */
  const phoneNumber = $params.get("phoneNumber") ?? null;
  const verificationToken = $params.get("verificationToken") ?? null;
  const [itsAllowedToRender, setItsAllowedToRender] = useState<boolean>(false);
  const [createAccountForm, setCreateAccountForm] = useState<{
    email: string;
    password1: string;
    password2: string;
  }>({
    email: "",
    password1: "",
    password2: ""
  });

  /* Init function */
  function init() {
    if(!phoneNumber || !verificationToken) {
      return $setParams(
        new URLSearchParams({
          act: "welcome"
        })
      );
    }

    setItsAllowedToRender(true);
  }

  useEffect(() => {
    init();
  }, []);

  /* On form submit */
  function onFormSubmit() {
    /* Validate user data */
    for(const validation of [
      validate("email", createAccountForm.email, "E-Mail"),
      validate("password", createAccountForm.password1, "Password"),
      validate("phoneNumber", phoneNumber, "Phone number"),
      createAccountForm.password1 === createAccountForm.password2 ||
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
    fetch("/users/create", {
      method: "POST",
      body: JSON.stringify({
        email: createAccountForm.email,
        password: createAccountForm.password1,
        phoneNumber,
        smsConfirmationToken: verificationToken
      })
    })
      .then(validateStatus)
      .then(({data: sessionToken}) => {
        setTimeout(() => {
          mainStore.setSessionToken(sessionToken);
        }, 0);
      })
      .catch(onError);
  }

  /* DOM */
  return itsAllowedToRender ? (
    <div className={styles.formContainer}>
      <h1>Create your account</h1>

      <div style={{height: 15}} />

      <div className={styles.tip}>
        Phone number successfully confirmed.
        <br />
        Enter your email address and password
      </div>

      <div style={{height: 50}} />

      <div className="form-container">
        <div className="fields-wrapper">
          <input
            type="text"
            placeholder="E-Mail..."
            value={createAccountForm.email}
            onChange={({target: {value}}) =>
              setCreateAccountForm({...createAccountForm, email: value})
            }
          />
        </div>

        <div className="fields-wrapper">
          <input
            type="password"
            placeholder="Password..."
            value={createAccountForm.password1}
            onChange={({target: {value}}) =>
              setCreateAccountForm({...createAccountForm, password1: value})
            }
          />
        </div>

        <div className="fields-wrapper">
          <input
            type="password"
            placeholder="Conform password..."
            value={createAccountForm.password2}
            onChange={({target: {value}}) =>
              setCreateAccountForm({...createAccountForm, password2: value})
            }
          />
        </div>
      </div>

      <div style={{height: 30}} />

      <div className={styles.tip}>
        By signing up on RichDragon,
        <br />
        you agree to our <a href="#">Terms of Use</a>
      </div>

      <div style={{height: 50}} />

      <button className="isBrown isDuctile" onClick={() => onFormSubmit()}>
        <span>Continue</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  ) : null;
}

/* Act / Sign In */
export function ActSignIn() {
  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  /* State */
  const [signInForm, setSignInForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: ""
  });

  /* On form submit */
  function onFormSubmit() {
    /* Validate user data */
    for(const validation of [
      validate("email", signInForm.email, "E-Mail"),
      validate("password", signInForm.password, "Password")
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

    fetch("/client/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: signInForm.email,
        password: signInForm.password,
        fingerprint: navigator.userAgent // FAKE for now
      })
    })
      .then(validateStatus)
      .then(({accessToken}) => {
        mainStore.setSessionToken(accessToken);
      })
      .catch(onError);
  }

  /* DOM */
  return (
    <div className={styles.formContainer}>
      <h1>Sign In</h1>

      <div style={{height: 30}} />

      <div className="form-container">
        <div className="fields-wrapper">
          <input
            type="text"
            placeholder="E-Mail..."
            value={signInForm.email}
            onChange={({target: {value}}) =>
              setSignInForm({...signInForm, email: value})
            }
          />
        </div>

        <div className="fields-wrapper">
          <input
            type="password"
            placeholder="Password..."
            value={signInForm.password}
            onChange={({target: {value}}) =>
              setSignInForm({...signInForm, password: value})
            }
          />
        </div>

        <div className="fields-wrapper">
          <button
            className="isZeroed"
            onClick={() =>
              $setParams(new URLSearchParams({...$params, act: "welcome"}))
            }
          >
            <span>Sign Up</span>
          </button>

          <button
            className="isZeroed"
            onClick={() =>
              $setParams(
                new URLSearchParams({...$params, act: "passwordReset"})
              )
            }
          >
            <span>Forgot password?</span>
          </button>
        </div>
      </div>

      <div style={{height: 50}} />

      <button className="isBrown isDuctile" onClick={() => onFormSubmit()}>
        <span>Sign In</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  );
}

/* Act / Password reset */
export function ActPasswordReset() {
  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  /* DOM */
  return (
    <div className={styles.formContainer}>
      <h1>Forgot password?</h1>

      <div style={{height: 15}} />

      <div className={styles.tip}>
        Enter the email address that you've used to register the account and we
        will send you a link to reset your password.
      </div>

      <div style={{height: 50}} />

      <div className="form-container">
        <div className="fields-wrapper" style={{gap: 10}}>
          <input type="text" />
          <button
            className="isDuctile isBlack isNarrow"
            style={{borderRadius: 12, padding: 20}}
            onClick={() =>
              $setParams(new URLSearchParams({...$params, act: "emailSent"}))
            }
          >
            <Icon
              icon="custom-arrow-left-1"
              style={{transform: `rotateZ(180deg)`}}
            />
          </button>
        </div>
      </div>

      <div style={{height: 20}} />

      <div
        className={styles.tip}
        style={{display: "flex", gap: 10, alignItems: "center"}}
        onClick={() =>
          $setParams(new URLSearchParams({...$params, act: "signIn"}))
        }
      >
        <span>Back to</span>
        <button className="isZeroed">Sign In</button>
      </div>
    </div>
  );
}

/* Act / Email sent */
export function ActEmailSent() {
  /* DOM */
  return (
    <div className={styles.formContainer}>
      <div
        style={{
          width: 90,
          height: 90,
          padding: 20,
          background: "#42D10F",
          borderRadius: "50%"
        }}
      >
        <Icon icon="custom-check-1" style={{stroke: "#fff"}} />
      </div>

      <div style={{height: 40}} />

      <div style={{fontSize: "28pt", fontWeight: 500}}>
        The email was successfully sent.
        <br />
        Please check your inbox
      </div>
    </div>
  );
}

/* Component */
export default function SignInPage() {
  /* Hooks */
  const [$params, $setParams] = useSearchParams();

  /* State */
  const [act, setAct] = useState<
    | "welcome"
    | "smsVerify"
    | "createAccount"
    | "signIn"
    | "passwordReset"
    | "emailSent"
  >("signIn");

  /* Set act as query parameter */
  useEffect(() => {
    let _act = $params.get("act");

    if(!_act) {
      return $setParams(new URLSearchParams({act: "signIn"}));
    }

    setAct(_act as "signIn");
  }, [$params]);

  /* DOM */
  return (
    <div className={styles.SignInPage}>
      <div className={styles.pageWrapper}>
        {/* Form wrapper */}
        <div className={styles.formWrapper}>
          <img src="/assets/images/full-logo.svg" alt="" />

          {act === "welcome" ? (
            <ActWelcome />
          ) : act === "smsVerify" ? (
            <ActSmsVerify />
          ) : act === "createAccount" ? (
            <ActCreateAccount />
          ) : act === "signIn" ? (
            <ActSignIn />
          ) : act === "passwordReset" ? (
            <ActPasswordReset />
          ) : act === "emailSent" ? (
            <ActEmailSent />
          ) : null}
        </div>

        {/* Page background */}
        <div
          className={styles.bgWrapper}
          style={{
            backgroundImage: `url("${bgImg}")`
          }}
        />
      </div>

      {/* Footer desktop */}
      <footer className={classNames(styles.footer, "hide-on-mobile")}>
        <img src="/assets/images/full-logo-dark.svg" alt="" />

        <div className={styles.footerFlexContainer}>
          <div
            style={{
              fontSize: "32pt"
            }}
          >
            hello@richdragon.hk
          </div>
          <button className="isBrown isDuctile">
            <span>Get started</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>

        <div className={styles.footerCopyright}>
          &copy; 2024 Rich Dragon. All Rights Reserved.
        </div>
      </footer>

      {/* Footer mobile */}
      <footer className={classNames(styles.footer, "hide-on-desktop")}>
        <div className={styles.footerFlexContainer}>
          <img
            src="/assets/images/full-logo-dark.svg"
            alt=""
            style={{width: "auto"}}
          />
          <button className="isBrown isDuctile" style={{padding: 15}}>
            <span>Get started</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>

        <div style={{height: 30}} />

        <div
          style={{
            fontSize: "32pt"
          }}
        >
          hello@richdragon.hk
        </div>

        <div
          className={styles.footerCopyright}
          style={{backgroundImage: `url("${bgImg}")`}}
        >
          <div>
            &copy; 2024 Rich Dragon.
            <br />
            All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
