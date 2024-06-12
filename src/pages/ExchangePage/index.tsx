import classNames from "classnames";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import styles from "./index.module.css";

export default function ExchangePage() {
  /* DOM */
  return (
    <div className={classNames(styles.ExchangePage, "isGray")}>
      <div className="pageHeader">
        <NavButton isA={true} to="">
          <Icon icon="custom-arrow-left-1" />
        </NavButton>
        <div />
        <h1>Exchange</h1>
      </div>

      <div style={{height: 30}} />

      <div className={styles.formWrapper}>
        <div className={classNames("form-container", styles.firstForm)}>
          <div className="form-label">Select currency</div>
          <div className="fields-wrapper __hasAfterContents">
            <select className="isGray" defaultValue="BTC">
              <option value="BTC">BTC</option>
            </select>
            <div>
              <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
            </div>
          </div>

          <div className="form-label">Amount</div>
          <div className="fields-wrapper __hasAfterContents">
            <input type="text" value="0.00000000" readOnly className="isGray" />
            <div style={{color: "#959595", pointerEvents: "none"}}>ETH</div>
          </div>

          <div className="form-small-tip" style={{fontWeight: 500}}>
            Network fee: 0%
          </div>
        </div>

        <div className={styles.formsArrow}>
          <Icon icon="custom-arrow-2" />
        </div>

        <div className={classNames("form-container", styles.secondForm)}>
          <div className="form-label">Select currency</div>
          <div className="fields-wrapper __hasAfterContents">
            <select className="isGray" defaultValue="BTC">
              <option value="BTC">BTC</option>
            </select>
            <div>
              <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
            </div>
          </div>

          <div className="form-label">Amount</div>
          <div className="fields-wrapper __hasAfterContents">
            <input type="text" value="0.00000000" readOnly className="isGray" />
            <div style={{color: "#959595", pointerEvents: "none"}}>ETH</div>
          </div>

          <div className="form-small-tip" style={{fontWeight: 500}}>
            Price: 0 ETH = 0 USD
          </div>
        </div>

        <button className="isBrown isDuctile hide-on-desktop">
          <span>Continue</span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>
      </div>

      <div style={{height: 50}} className="hide-on-mobile" />

      <button className="isBrown isDuctile hide-on-mobile">
        <span>Exchange</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </div>
  );
}
