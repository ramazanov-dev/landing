import classNames from "classnames";
import {useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import Icon from "~components/Icon";
import styles from "./index.module.css";

export default function KycRightAside(props: {
  stepsPassed: number;
  isActive: boolean;
  onClose(): void;
}) {
  /* Hooks */
  const $location = useLocation();

  /* Close on navigate */
  useEffect(() => {
    props.onClose();
  }, [$location]);

  /* DOM */
  return (
    <div
      className={classNames(styles.KycRightAside, {
        isHidden: !props.isActive
      })}
    >
      <div className={styles.closeButtonWrapper}>
        <div style={{cursor: "pointer"}} onClick={() => props.onClose()}>
          <Icon icon="custom-close-1" />
        </div>
      </div>

      <div className={styles.asideHeader}>Steps {props.stepsPassed}/5</div>

      <div className={styles.stepsContainer}>
        <div
          className={classNames(styles.step, {
            isPassed: props.stepsPassed >= 1
          })}
        >
          <div className={styles.stepIcon}>
            <Icon icon="custom-check-1" />
          </div>
          <div className={styles.stepContents}>
            <Link to="/kyc/personal">Personal information</Link>
          </div>
        </div>

        <div
          className={classNames(styles.step, {
            isPassed: props.stepsPassed >= 2
          })}
        >
          <div className={styles.stepIcon}>
            <Icon icon="custom-check-1" />
          </div>
          <div className={styles.stepContents}>
            <Link to="/kyc/address">Address</Link>
          </div>
        </div>

        <div
          className={classNames(styles.step, {
            isPassed: props.stepsPassed >= 3
          })}
        >
          <div className={styles.stepIcon}>
            <Icon icon="custom-check-1" />
          </div>
          <div className={styles.stepContents}>
            <Link to="/kyc/documents">Documents</Link>
          </div>
        </div>

        <div
          className={classNames(styles.step, {
            isPassed: props.stepsPassed >= 4
          })}
        >
          <div className={styles.stepIcon}>
            <Icon icon="custom-check-1" />
          </div>
          <div className={styles.stepContents}>
            <Link to="/kyc/photo">Photo</Link>
          </div>
        </div>

        <div
          className={classNames(styles.step, {
            isPassed: props.stepsPassed === 5
          })}
        >
          <div className={styles.stepIcon}>
            <Icon icon="custom-check-1" />
          </div>
          <div className={styles.stepContents}>
            <Link to="/kyc/soi">Source of income</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
