import {useNavigate} from "react-router-dom";
import Icon from "~components/Icon";
import styles from "./index.module.css";

export default function FastExchangeBlock() {
  /* Hooks */
  const $navigate = useNavigate();

  /* DOM */
  return (
    <div id="fast-exchange" className={styles.FastExchange}>
      <div className={styles.container}>
        <h1>Join Now for Fast and Safe Token Swaps</h1>
        <p>In no time, you can securely and effortlessly swap your tokens in your personal account. Don’t miss out —join
          us now!</p>

        {/* Positions */}
        <div className={styles.positionsContainer}>
          <div className={styles.position}>
            <div>1</div>
            <div>ETH</div>
          </div>

          <div className={styles.positionsIcon}>
            <Icon icon="custom-arrow-2" />
          </div>

          <div className={styles.position}>
            <div>3450</div>
            <div>USDT</div>
          </div>
        </div>

        {/* Misc */}
        <div className={styles.miscContainer}>
          <div style={{color: "#A8A8A8"}}>Exchange fee: 0%</div>

          <button
            className="isDuctile isDarkBlue"
            onClick={() => $navigate("/exchange")}
          >
            <span>Exchange</span>
            <Icon icon="custom-arrow-top-right-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
