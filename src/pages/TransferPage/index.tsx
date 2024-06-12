import {useQuery} from "@tanstack/react-query";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useCallback,
  useMemo,
  useState
} from "react";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import type {ICryptoTransferArgsPrecised} from "~pages/TransferPage/interface";
import type {
  IBalanceItem,
  ICryptoCurrency
} from "~pages/WalletPage/interface";
import type {ICryptoWithdrawalArgsPrecised} from "~pages/WithdrawPage/interface";
import type {ValueOrNull} from "~types/global";
import {fetch, validateStatus} from "~utils/fetch";
import {getRandomNumber} from "~utils/misc";
import {queryClient} from "../..//query-client";
import mainStore from "../../store/main";
import styles from "./index.module.css";

export const defaultCryptoCurrency = "BTC";
export default function TransferPage() {
  const {data: cryptoCurrencies, isSuccess: isCryptoCurrenciesLoaded} =
    useQuery<ICryptoCurrency[]>({
      queryKey: ["/client/crypto/currencies"]
    });
  const {data: balances} = useQuery<IBalanceItem[]>({
    queryKey: ["/client/balances"],
    enabled: isCryptoCurrenciesLoaded
  });

  const currencyList = useMemo(
    () => [
      ...(cryptoCurrencies?.map(({currency}) => ({
        label: currency,
        value: currency
      })) ?? [])
    ],
    [cryptoCurrencies]
  );
  const [transfer, setTransfer] = useState<ICryptoTransferArgsPrecised>(() => ({
    amount: new Decimal(0).toFixed(8).slice(0, 10),
    currency: defaultCryptoCurrency,
    userId: ""
  }));
  const currency = useMemo<ValueOrNull<ICryptoCurrency>>(
    () =>
      cryptoCurrencies?.find(
        (currency) => currency.currency === transfer.currency
      ) ?? null,
    [cryptoCurrencies, transfer.currency]
  );
  const balance = useMemo<ValueOrNull<IBalanceItem>>(
    () =>
      balances?.find((currency) => currency.currency === transfer.currency) ??
      null,
    [transfer.currency]
  );

  const {available, amount, canTransfer} = useMemo(() => {
    const currentBalance = balance?.available ?? 0;

    return {
      available: new Decimal(currentBalance - Number(transfer.amount))
        .toFixed(8)
        .slice(0, 10),
      amount: new Decimal(transfer.amount).toFixed(8).slice(0, 10),
      canTransfer:
        currentBalance > 0 && currentBalance - Number(transfer.amount) >= 0
    };
  }, [balance, currency, transfer.amount]);

  return (
    <form
      className={classNames(styles.TransferPage, "isGray")}
      onSubmit={useCallback<FormEventHandler<HTMLFormElement>>(
        (e) => {
          e.preventDefault();

          fetch("/client/crypto/INTERNAL_crypto_transfer", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${mainStore.sessionToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...transfer,
              amount: Number(transfer.amount)
            })
          })
            .then(validateStatus)
            .then(() => {
              queryClient.resetQueries({
                queryKey: ["/client/crypto/currencies", "/client/balances"]
              });
              return mainStore.addNotification({
                id: getRandomNumber(0, 9999999).toString(16),
                title: "Success",
                contents: "Transfer successful"
              });
            })
            .catch(() => {
              return mainStore.addNotification({
                id: getRandomNumber(0, 9999999).toString(16),
                title: "Error",
                contents: "Transfer failed"
              });
            });
        },
        [transfer]
      )}
    >
      <div className="pageHeader">
        <NavButton isA={true} to="">
          <Icon icon="custom-arrow-left-1" />
        </NavButton>
        <div />
        <h1>Transfer</h1>
      </div>

      <div style={{height: 30}} />

      <div className={styles.formWrapper}>
        <div className={classNames("form-container", styles.formContainer)}>
          <div className="form-label">Select currency</div>
          <div className="fields-wrapper __hasAfterContents">
            <select
              name="currency"
              className="isGray"
              value={transfer.currency}
              onChange={useCallback<ChangeEventHandler<HTMLSelectElement>>(
                (e) => {
                  setTransfer((transfer) => ({
                    ...transfer,
                    currency: e.target.value as ICryptoCurrency["currency"]
                  }));
                },
                []
              )}
              required
            >
              {currencyList.map(({label, ...props}) => (
                <option key={props.value} {...props}>
                  {label}
                </option>
              ))}
            </select>
            <div>
              <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
            </div>
          </div>

          <div className="form-label">Client E-Mail</div>
          <div className="fields-wrapper">
            <input
              name="userId"
              type="email"
              className="isGray"
              value={transfer.userId}
              onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                (e) => {
                  setTransfer((transfer) => ({
                    ...transfer,
                    userId: e.target.value
                  }));
                },
                []
              )}
              required
            />
          </div>

          <div className="form-label">Amount</div>
          <div className="fields-wrapper __hasAfterContents">
            <input
              name="amount"
              type="text"
              value={amount}
              onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                (e) => {
                  setTransfer((transfer) => ({
                    ...transfer,
                    amount: e.target.value
                  }));
                },
                []
              )}
              className="isGray"
              maxLength={10}
              required
              disabled={!balance?.available}
            />
            <div style={{color: "#959595", pointerEvents: "none"}}>
              {transfer.currency}
            </div>
          </div>
        </div>
        <div className={styles.formResults}>
          <div className={styles.formResultsHeader}>Total</div>

          <div className="data-rows">
            <div className="data-rows-item">
              <span>Available</span>
              <span>
                {available} {transfer.currency}
              </span>
            </div>
          </div>
        </div>

        <button
          className="isBrown isDuctile hide-on-desktop"
          type="submit"
          disabled={!canTransfer}
        >
          <span>Transfer</span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>
      </div>

      <div style={{height: 50}} className="hide-on-mobile" />

      <button
        className="isBrown isDuctile hide-on-mobile"
        type="submit"
        disabled={!canTransfer}
      >
        <span>Transfer</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </form>
  );
}
